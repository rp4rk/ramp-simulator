import { getActiveBuffs } from "lib/buff";
import { StateSpellReducer } from "lib/types";

/**
 * Extend the duration of an aura
 * @param auraName The name of the aura
 * @param amount The amount in MS to extend the aura by
 * @returns state
 */
export const extendOvertime =
  (auraName: string, amount: number): StateSpellReducer =>
  (state) => {
    const auras = getActiveBuffs(state, auraName);
    if (auras.length === 0) return state;

    // Side effect
    auras.forEach((mindbender) => {
      mindbender.duration += amount;
      mindbender.expires += amount;
    });

    return state;
  };

/**
 * Reduce the duration of an aura
 * @param auraName the name of the aura
 * @param amount The amount in MS to reduce the aura by
 * @returns state
 */
export const reduceOvertime = (auraName: string, amount: number) => {
  return extendOvertime(auraName, -amount);
};
