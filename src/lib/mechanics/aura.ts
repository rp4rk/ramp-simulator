import { getAura } from "lib/buff";
import { SimState, Buff, OverTime, HoT, CalculatedBuff } from "../types";

/**
 * Returns the simulation state with the provided aura(s) applied to the players buffs
 *
 * TODO: Remove the third argument here and incorporate it into a data structure
 */
export const applyAura = (
  state: SimState,
  uncalculatedAura: Buff | OverTime | HoT,
  num: number = 1,
  stacks: number = 1
): SimState => {
  const auraApplication =
    typeof uncalculatedAura.applied === "function"
      ? uncalculatedAura.applied(state)
      : uncalculatedAura.applied || state.time;

  const auraDuration =
    typeof uncalculatedAura.duration === "function"
      ? uncalculatedAura.duration(state)
      : uncalculatedAura.duration;

  const auraExpiry =
    typeof uncalculatedAura.expires === "function"
      ? uncalculatedAura.expires(state)
      : uncalculatedAura.expires || auraApplication + auraDuration;

  const aura = {
    ...uncalculatedAura,
    applied: auraApplication,
    expires: auraExpiry,
    duration: auraDuration,
    stacks,
  };

  const existingAuras = state.buffs.get(aura.name) || [];
  const newAuras = Array.from({ length: num }, () => {
    return { ...aura } as CalculatedBuff | OverTime | HoT;
  });
  const newAuraArr = [...existingAuras, ...newAuras];

  // Regular buff handling
  if (!("interval" in aura) || "hot" in aura) {
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

export const applyAuraStack = (state: SimState, auraName: string, stacks: number): SimState => {
  const aura = getAura(state, auraName);
  if (!aura) {
    return state;
  }

  const newAura = { ...aura, stacks: aura.stacks + stacks, expires: state.time + aura.duration };
  const existingAuras = state.buffs.get(auraName)?.slice(0, -1) || [];

  return {
    ...state,
    buffs: new Map(state.buffs).set(auraName, [...existingAuras, newAura]),
  };
};

export const clearAuraStack = (state: SimState, auraName: string): SimState => {
  const aura = getAura(state, auraName);
  if (!aura) {
    return state;
  }

  const newAura = { ...aura, stacks: 0 };
  const existingAuras = state.buffs.get(auraName)?.slice(0, -1) || [];

  return {
    ...state,
    buffs: new Map(state.buffs).set(auraName, [...existingAuras, newAura]),
  };
};

export const getAuraStacks = (state: SimState, auraName: string): number => {
  const aura = getAura(state, auraName);
  if (!aura) {
    return 0;
  }

  return aura.stacks;
};
