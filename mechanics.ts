import {
  buffActive,
  getActiveBuffs,
  getActiveDoTs,
  numBuffsActive,
} from "./buff";
import {
  getCritPerc,
  getHastePerc,
  getMasteryPerc,
  getVersPerc,
} from "./player";
// import { AscendedEruption } from "./spells";
import { Spell, SimState, Buff, DoT, StateSpellReducer } from "./types";

/**
 * Advance time in the sim
 * @param state
 * @param spell
 * @returns
 */
export const advanceTime = (state: SimState, spell: Spell): SimState => {
  const playerHaste = getHastePerc(state.player);

  if (spell.castTime) {
    return {
      ...state,
      time: Math.round(state.time + spell.castTime / playerHaste),
    };
  }
  if (spell.shortGcd) {
    return { ...state, time: state.time + Math.max(1000 / playerHaste, 750) };
  }
  if (spell.offGcd) {
    return state;
  }

  return { ...state, time: state.time + Math.max(1500 / playerHaste, 750) };
};

function calculateDamage(state: SimState, spell: Spell): number {
  if (!spell.damage) return 0;

  const initialDamage =
    typeof spell.damage === "function" ? spell.damage(state) : spell.damage;

  const isSchismActive = buffActive(state, "Schism");
  const schismMultiplier = isSchismActive ? 1.25 : 1;

  const { player } = state;

  return (
    (initialDamage / 100) *
    schismMultiplier *
    player.spellpower *
    getCritPerc(player) *
    getVersPerc(player) *
    1.03
  );
}

/**
 * Apply damage in the sim
 * @param state
 * @param spell
 * @returns
 */
export const damage: StateSpellReducer = (state, spell): SimState => {
  return {
    ...state,
    damage: Math.round(state.damage + calculateDamage(state, spell)),
  };
};

/**
 * Apply damage in the sim
 * @param state
 * @param spell
 * @returns
 */
export const absorb: StateSpellReducer = (state, spell): SimState => {
  if (!spell.absorb) return state;
  const { player } = state;
  const initialAbsorb =
    typeof spell.absorb === "function" ? spell.absorb(state) : spell.absorb;

  return {
    ...state,
    absorb: Math.round(
      state.absorb +
        (initialAbsorb / 100) *
          player.spellpower *
          getCritPerc(player) *
          getVersPerc(player)
    ),
  };
};

/**
 * Apply damage in the sim
 * @param state
 * @param spell
 * @returns
 */
export const healing: StateSpellReducer = (state, spell): SimState => {
  if (!spell.healing) return state;
  const initialHealing =
    typeof spell.healing === "function" ? spell.healing(state) : spell.healing;
  const spiritShellActive = buffActive(state, "Spirit Shell");
  const { player } = state;

  const calculatedHealing =
    (initialHealing / 100) *
    0.864 *
    getCritPerc(player) *
    getVersPerc(player) *
    player.spellpower;

  if (spell.name === "Power Word: Radiance" && spiritShellActive) {
    const shellAmount = Math.round(calculatedHealing);

    return {
      ...state,
      absorb: Math.round(state.absorb + shellAmount),
    };
  }

  return { ...state, healing: Math.round(state.healing + calculatedHealing) };
};

/**
 * Applies auras lol
 * @param state
 * @param aura
 * @returns
 */
export const applyAura = (
  state: SimState,
  aura: Buff | DoT,
  num: number = 1
): SimState => {
  const existingAuras = state.buffs.get(aura.name) || [];
  const newAuras = Array.from({ length: num }, () => aura);
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
  const durationCeiling = duration + pandemicWindow;

  const originalDurationRemaining = expires - time;
  const pandemicValue = Math.min(originalDurationRemaining, pandemicWindow);

  // Shitty side effect but w/e
  previousApplication.expires = time + duration + pandemicValue;

  return state;
};

/**
 * Applies atonement healing + Spirit Shell
 * @param state
 * @param spell
 * @returns
 */
export const atonement: StateSpellReducer = (state, spell): SimState => {
  const spiritShellActive = buffActive(state, "Spirit Shell");
  const calculatedDamage = calculateDamage(state, spell);
  const activeAtonementCount = numBuffsActive(state, "Atonement");
  const { player } = state;
  const mastery = getMasteryPerc(player);

  if (spiritShellActive) {
    const shellAmount = Math.round(
      calculatedDamage * 0.5 * 0.864 * activeAtonementCount * mastery
    );

    return {
      ...state,
      absorb: Math.round(state.absorb + shellAmount),
    };
  }

  return {
    ...state,
    healing: Math.round(
      state.healing + calculatedDamage * 0.5 * activeAtonementCount * mastery
    ),
  };
};

/**
 * Extends Atonements for Clarity of Mind
 * TODO: Rapture
 * @param state
 * @param spell
 * @returns
 */
export const ClarityOfMind: StateSpellReducer = (state, spell): SimState => {
  if (!buffActive(state, "Clarity of Mind")) return state;
  const atonements = getActiveBuffs(state, "Atonement");

  atonements.forEach((buff) => {
    buff.duration = buff.duration + 3000;
    buff.expires = buff.expires + 3000;
  });

  return state;
};

/**
 * Advances the in game time to match the cooldown of spells
 * @param state
 * @param spell
 * @returns
 */
export const Cooldown: StateSpellReducer = (state, spell): SimState => {
  if (!spell.cooldown) return state;

  // Advance time if needed
  const lastCastRefreshTime = state.cooldowns.get(spell.name) || 0;
  const shouldTimeTravel = lastCastRefreshTime > state.time;
  const newTime = shouldTimeTravel ? lastCastRefreshTime : state.time;

  // Calculate cooldown
  const initialCooldown =
    typeof spell.cooldown === "function"
      ? spell.cooldown(state)
      : spell.cooldown;

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

  const exampleDoT = activeDoTs[0];
  const exampleDoTDuration = exampleDoT.expires - exampleDoT.applied;
  const hastedInterval = exampleDoT.interval / haste;
  const totalTickCount = exampleDoTDuration / hastedInterval;

  const tickTimes = Array.from(
    { length: Math.ceil(totalTickCount) },
    (_, i) => {
      const isFinalTick = Math.ceil(totalTickCount) === i + 1;

      if (!isFinalTick) {
        return (i + 1) * hastedInterval;
      }

      const partialTickRatio = totalTickCount - Math.floor(totalTickCount);
      return i * hastedInterval + hastedInterval * partialTickRatio;
    }
  );

  console.log(tickTimes);

  return state;
};
