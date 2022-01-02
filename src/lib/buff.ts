import { SimState, OverTime, CalculatedBuff, HoT } from "./types";

/**
 * Checks if a buff is active
 */
export const hasAura = (state: SimState, name: string): Boolean => {
  return (
    state.buffs.get(name)?.reduceRight((acc, curr) => {
      if (acc === true) return acc;

      return state.time >= curr.applied && state.time <= curr.expires;
    }, false) || false
  );
};

/**
 * Checks the count of buffs active
 */
export const numBuffsActive = (state: SimState, name: string): number => {
  return getActiveBuffs(state, name).length;
};

/**
 * Gets active buffs
 */
export const getActiveBuffs = (state: SimState, name: string): CalculatedBuff[] => {
  return (
    state.buffs.get(name)?.reduceRight<CalculatedBuff[]>((acc, curr) => {
      if (state.time < curr.applied || state.time > curr.expires) {
        return acc;
      }

      return [...acc, curr];
    }, []) || []
  );
};

/**
 * Returns all active DoT effects
 */
export const getActiveDoTs = (state: SimState): OverTime[] => {
  return Array.from(state.buffs.values())
    .flatMap((i) => i)
    .reduceRight<OverTime[]>((acc, aura) => {
      if (!("dot" in aura)) {
        return acc;
      }
      if (state.time > aura.expires) {
        return acc;
      }

      return [...acc, aura];
    }, []);
};

/**
 * Returns all active HoT effects
 */
export const getActiveHoTs = (state: SimState): HoT[] => {
  return Array.from(state.buffs.values())
    .flatMap((i) => i)
    .reduceRight<HoT[]>((acc, aura) => {
      if (!("hot" in aura)) {
        return acc;
      }
      if (state.time > aura.expires) {
        return acc;
      }

      return [...acc, aura];
    }, []);
};
