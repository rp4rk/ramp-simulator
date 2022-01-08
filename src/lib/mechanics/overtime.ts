import { StateSpellReducer, SimState, OverTime } from "../types";
import { getHastePerc } from "../player";
import { advanceTime } from "./time";
import { getActiveDoTs, getActiveHoTs } from "../buff";
import { atonement } from "./atonement";
import { damage } from "./damage";
import { healing } from "./healing";

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
    const [dot, calculatedDamage, projectedTime] = tick;
    const partialDot = { ...dot, damage: calculatedDamage };
    const nextState = atonement(damage({ ...prevState, time: projectedTime }, partialDot), partialDot);

    return {
      ...nextState,
      time,
    };
  }, state);
};

export const executeHoT: StateSpellReducer = (state, spell): SimState => {
  const { time } = state;

  // Get the projected time for this event
  const { time: projectedTime } = advanceTime(state, spell);
  const haste = getHastePerc(state.player);

  // Get currently active DoTs
  const activeHoTs = getActiveHoTs(state);
  if (activeHoTs.length === 0) return state;

  const tickTimes = activeHoTs
    .map((dot) => getTickTimes(dot, haste, state))
    .flatMap((i) => pickBetween(time, projectedTime, i));

  // Log stuff out
  tickTimes.forEach((tick) => {
    console.log(`[HOT][${tick[2]}] ${tick[0].name} hitting for ${tick[1]}`);
  });

  // return state;
  return tickTimes.reduce((prevState, tick) => {
    const { time } = prevState;
    const [dot, calculatedHealing, projectedTime] = tick;

    const partialHoT = { ...dot, healing: calculatedHealing };
    const nextState = healing({ ...prevState, time: projectedTime }, partialHoT);

    return {
      ...nextState,
      time,
    };
  }, state);
};

type Tick = [OverTime, number, number];
const getTickTimes = function getTickTimes(xot: OverTime, haste: number, state: SimState): Tick[] {
  const exampleDoTDuration = xot.expires - xot.applied;
  const baseInterval = typeof xot.interval === "function" ? xot.interval(state) : xot.interval;
  const hastedInterval = baseInterval / haste;
  const isPet = xot.name === "Shadowfiend" || xot.name === "Mindbender";
  const totalTickCount = isPet
    ? Math.floor(exampleDoTDuration / hastedInterval)
    : Math.ceil(exampleDoTDuration / hastedInterval);

  return Array.from({ length: Math.ceil(totalTickCount) }, (_, i) => {
    const isFinalTick = Math.ceil(totalTickCount) === i + 1;

    if (!isFinalTick || isPet) {
      return [xot, xot.coefficient, xot.applied + (i + 1) * hastedInterval];
    }

    const partialTickRatio = totalTickCount - Math.floor(totalTickCount);
    return [
      xot,
      xot.coefficient * partialTickRatio,
      xot.applied + (i * hastedInterval + hastedInterval * partialTickRatio),
    ];
  });
};

function pickBetween(n: number, o: number, numbers: Tick[]): Tick[] {
  return numbers.filter(([_, , i]) => i >= n && i < o);
}
