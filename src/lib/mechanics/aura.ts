import { SimState, Buff, OverTime, HoT, CalculatedBuff } from "../types";

/**
 * Returns the simulation state with the provided aura(s) applied to the players buffs
 *
 * TODO: Remove the third argument here and incorporate it into a data structure
 */
export const applyAura = (state: SimState, uncalculatedAura: Buff | OverTime | HoT, num: number = 1): SimState => {
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
    return { ...aura } as CalculatedBuff | OverTime | HoT;
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
