import { hasAura, getActiveBuffs, getActiveDoTs, numBuffsActive } from "./buff";
import { getCritPerc, getHastePerc, getMasteryPerc, getVersPerc } from "./player";
import { Spell, SimState, Buff, DoT, StateSpellReducer, CalculatedBuff } from "./types";

function logWrap(fn: StateSpellReducer): StateSpellReducer {
  return function (innerState: SimState, spell: Spell) {
    const projectedState = fn(innerState, spell);

    console.log(`[TIME PROJECTION][${innerState.time}]->[${projectedState.time}] Casting ${spell.name}`);

    return projectedState;
  };
}

/**
 * Advance time in the sim
 */
export const advanceTime = logWrap((state: SimState, spell): SimState => {
  if ("dot" in spell) return state;
  const playerHaste = getHastePerc(state.player);

  // Handle channel ticks
  if ("channel" in spell && spell.castTime) {
    return { ...state, time: Math.round(state.time + spell.castTime / playerHaste) };
  }

  // Handle spells with a fixed GCD, i.e. Word of Recall
  if (spell.fixedGcd && spell.castTime) {
    return { ...state, time: state.time + spell.castTime };
  }

  // Handle regular cast time spells
  if (!spell.fixedGcd && spell.castTime) {
    return {
      ...state,
      time: Math.round(state.time + spell.castTime / playerHaste),
    };
  }

  // Handle short GCD spells such as Ascended Nova
  if (spell.shortGcd) {
    return { ...state, time: state.time + Math.max(1000 / playerHaste, 750) };
  }

  // Handle spells that are off GCD
  if (spell.offGcd) {
    return state;
  }

  return { ...state, time: state.time + Math.max(1500 / playerHaste, 750) };
});

const IGNORED_FOR_SCHISM = ["Shadowfiend", "Mindbender"];
function calculateDamage(state: SimState, spell: Spell | DoT): number {
  if (!spell.damage) return 0;

  const initialDamage = typeof spell.damage === "function" ? spell.damage(state) : spell.damage;

  const isSchismActive = hasAura(state, "Schism");
  const schismMultiplier = isSchismActive ? 1.25 : 1;

  const { player } = state;

  return (
    (initialDamage / 100) *
    (IGNORED_FOR_SCHISM.includes(spell.name) ? 1 : schismMultiplier) *
    player.spellpower *
    getCritPerc(player) *
    getVersPerc(player) *
    1.03
  );
}

/**
 * Apply damage in the sim
 */
export const damage: StateSpellReducer = (state, spell): SimState => {
  return {
    ...state,
    damage: state.damage + calculateDamage(state, spell),
  };
};

/**
 * Apply absorbs in the sim
 */
export const absorb: StateSpellReducer = (state, spell): SimState => {
  if ("interval" in spell) return state;
  if (!spell.absorb) return state;
  const { player } = state;
  const initialAbsorb = typeof spell.absorb === "function" ? spell.absorb(state) : spell.absorb;

  return {
    ...state,
    absorb: state.absorb + (initialAbsorb / 100) * player.spellpower * getCritPerc(player) * getVersPerc(player),
  };
};

/**
 * Apply healing in the sim
 */
export const healing: StateSpellReducer = (state, spell): SimState => {
  if ("interval" in spell) return state;
  if (!spell.healing) return state;
  const initialHealing = typeof spell.healing === "function" ? spell.healing(state) : spell.healing;
  const spiritShellActive = hasAura(state, "Spirit Shell");
  const { player } = state;

  const calculatedHealing = (initialHealing / 100) * getCritPerc(player) * getVersPerc(player) * player.spellpower;

  if (spell.name === "Power Word: Radiance" && spiritShellActive) {
    const shellAmount = calculatedHealing * 0.864;

    return {
      ...state,
      absorb: state.absorb + shellAmount,
    };
  }

  return { ...state, healing: state.healing + calculatedHealing };
};

/**
 * Applies auras
 */
export const applyAura = (state: SimState, uncalculatedAura: Buff | DoT, num: number = 1): SimState => {
  const auraDuration =
    typeof uncalculatedAura.duration === "function" ? uncalculatedAura.duration(state) : uncalculatedAura.duration;

  const auraExpiry =
    typeof uncalculatedAura.expires === "function"
      ? uncalculatedAura.expires(state)
      : uncalculatedAura.expires || state.time + auraDuration;

  const aura = {
    ...uncalculatedAura,
    expires: auraExpiry,
    duration: auraDuration,
  };

  const existingAuras = state.buffs.get(aura.name) || [];
  const newAuras = Array.from({ length: num }, () => {
    return { ...aura } as CalculatedBuff | DoT;
  });
  const newAuraArr = [...existingAuras, ...newAuras];

  // Regular buff handling
  if (!("interval" in aura)) {
    state.buffs.set(aura.name, newAuraArr);
    return state;
  }

  // Pandemic code
  const previousApplication = existingAuras[existingAuras.length - 1];
  if (!previousApplication || !("interval" in previousApplication)) {
    state.buffs.set(aura.name, newAuraArr);
    return state;
  }

  const { time } = state;
  const { expires } = previousApplication;

  // Handle new DoTs
  if (time > expires) {
    state.buffs.set(aura.name, newAuraArr);
    return state;
  }

  // Calculate Pandemic and Apply It
  const { duration } = aura;
  const pandemicWindow = Math.round(duration * 0.3);

  const originalDurationRemaining = expires - time;
  const pandemicValue = Math.min(originalDurationRemaining, pandemicWindow);

  // Shitty side effect but w/e
  previousApplication.expires = time + duration + pandemicValue;

  return state;
};

/**
 * Channel wraps the provided reducers, advanceTime does not need to be explicitly stated
 */
export const channel =
  (effects: StateSpellReducer[]): StateSpellReducer =>
  (state, spell): SimState => {
    if (!("channel" in spell)) throw new Error(`Skill Issue: Channel effect on non-channel spell: ${spell.name}`);
    if (spell.castTime === undefined)
      throw new Error(`Skill Issue: Channel without a castTime encountered: ${spell.name}`);

    const ticks = typeof spell.ticks === "function" ? spell.ticks(state) : spell.ticks;
    const { castTime } = spell;
    const channelInterval = castTime / (ticks - 1);

    const effectsToRepeat: StateSpellReducer[] = [...effects, advanceTime];
    const computedEffects = Array<StateSpellReducer[]>(ticks - 1)
      .fill(effectsToRepeat)
      .flat();

    const channelWithDuration = {
      ...spell,
      castTime: channelInterval,
    };

    const projectedState = computedEffects.reduce((currState, currEffect) => {
      return currEffect(currState, channelWithDuration);
    }, state);

    return projectedState;
  };

/**
 * Applies atonement healing + Spirit Shell
 */
export const atonement: StateSpellReducer = (state, spell): SimState => {
  const spiritShellActive = hasAura(state, "Spirit Shell");
  const calculatedDamage = calculateDamage(state, spell);
  const activeAtonementCount = numBuffsActive(state, "Atonement");
  const { player } = state;
  const mastery = getMasteryPerc(player);

  if (spiritShellActive) {
    const shellAmount = calculatedDamage * 0.5 * 0.864 * activeAtonementCount * mastery;

    return {
      ...state,
      absorb: state.absorb + shellAmount,
    };
  }

  return {
    ...state,
    healing: state.healing + calculatedDamage * 0.5 * activeAtonementCount * mastery,
  };
};

/**
 * Extends Atonements for Clarity of Mind
 */
export const ClarityOfMind: StateSpellReducer = (state, spell): SimState => {
  if (!hasAura(state, "Clarity of Mind")) return state;
  const atonements = getActiveBuffs(state, "Atonement");

  atonements.forEach((buff) => {
    buff.duration = buff.duration + 3000;
    buff.expires = buff.expires + 3000;
  });

  return state;
};

/**
 * Extends Atonements for Evangelism
 */
export const EvangelismExtension: StateSpellReducer = (state, spell): SimState => {
  const atonements = getActiveBuffs(state, "Atonement");

  atonements.forEach((buff) => {
    buff.duration = buff.duration + 6000;
    buff.expires = buff.expires + 6000;
  });

  return state;
};

/**
 * Advances the in game time to match the cooldown of spells
 */
export const Cooldown: StateSpellReducer = (state, spell): SimState => {
  if ("interval" in spell) return state;
  if (!spell.cooldown) return state;

  // Advance time if needed
  const lastCastRefreshTime = state.cooldowns.get(spell.name) || 0;
  const shouldTimeTravel = lastCastRefreshTime > state.time;
  const newTime = shouldTimeTravel ? lastCastRefreshTime : state.time;

  // Calculate cooldown
  const initialCooldown = typeof spell.cooldown === "function" ? spell.cooldown(state) : spell.cooldown;

  state.cooldowns.set(spell.name, state.time + initialCooldown);

  return {
    ...state,
    time: newTime,
  };
};

export const executeDoT: StateSpellReducer = (state, spell): SimState => {
  const { time } = state;

  // Get the projected time for this event
  const { time: projectedTime } = advanceTime(state, spell);
  const haste = getHastePerc(state.player);

  // Get currently active DoTs
  const activeDoTs = getActiveDoTs(state);
  if (activeDoTs.length === 0) return state;

  const tickTimes = activeDoTs
    .map((dot) => getTickTimes(dot, haste, state))
    .flatMap((i) => pickBetween(time, projectedTime, i));

  // Log stuff out
  tickTimes.forEach((tick) => {
    console.log(`[DOT/PET][${tick[2]}] ${tick[0].name} hitting for ${tick[1]}`);
  });

  // return state;
  return tickTimes.reduce((prevState, tick) => {
    const { time } = prevState;
    const [dot, calcaulatedDamage, projectedTime] = tick;
    const partialDot = { ...dot, damage: calcaulatedDamage };
    const nextState = atonement(damage({ ...prevState, time: projectedTime }, partialDot), partialDot);

    return {
      ...nextState,
      time,
    };
  }, state);
};

type tick = [DoT, number, number];
const getTickTimes = function getTickTimes(dot: DoT, haste: number, state: SimState): tick[] {
  const exampleDoTDuration = dot.expires - dot.applied;
  const baseInterval = typeof dot.interval === "function" ? dot.interval(state) : dot.interval;
  const hastedInterval = baseInterval / haste;
  const isPet = dot.name === "Shadowfiend" || dot.name === "Mindbender";
  const totalTickCount = isPet
    ? Math.floor(exampleDoTDuration / hastedInterval)
    : Math.ceil(exampleDoTDuration / hastedInterval);

  return Array.from({ length: Math.ceil(totalTickCount) }, (_, i) => {
    const isFinalTick = Math.ceil(totalTickCount) === i + 1;

    if (!isFinalTick || isPet) {
      return [dot, dot.damage, dot.applied + (i + 1) * hastedInterval];
    }

    const partialTickRatio = totalTickCount - Math.floor(totalTickCount);
    return [dot, dot.damage * partialTickRatio, dot.applied + (i * hastedInterval + hastedInterval * partialTickRatio)];
  });
};

function pickBetween(n: number, o: number, numbers: tick[]): tick[] {
  return numbers.filter(([_, , i]) => i >= n && i < o);
}
