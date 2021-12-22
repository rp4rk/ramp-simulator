import { Buff, SimState, DoT, CalculatedBuff } from "./types";

/**
 * Checks if a buff is active
 * @param state
 * @param name
 * @returns
 */
export const hasAura = (state: SimState, name: string): Boolean => {
  return (
    state.buffs.get(name)?.reduceRight((acc, curr) => {
      if (acc === true) return acc;

      return state.time <= curr.expires;
    }, false) || false
  );
};

/**
 * Checks the count of buffs active
 * @param state
 * @param name
 * @returns
 */
export const numBuffsActive = (state: SimState, name: string): number => {
  return (
    state.buffs.get(name)?.reduceRight((acc, curr) => {
      if (state.time <= curr.expires) {
        return acc + 1;
      }

      return acc;
    }, 0) || 0
  );
};

/**
 * Gets active buffs
 * @param state
 * @param name
 * @returns
 */
export const getActiveBuffs = (state: SimState, name: string): CalculatedBuff[] => {
  return (
    state.buffs.get(name)?.reduceRight<CalculatedBuff[]>((acc, curr) => {
      if (state.time > curr.expires) {
        return acc;
      }

      return [...acc, curr];
    }, []) || []
  );
};

/**
 * Returns all active DoT effects
 * @param state
 * @returns
 */
export const getActiveDoTs = (state: SimState): DoT[] => {
  return Array.from(state.buffs.values())
    .flatMap((i) => i)
    .reduceRight<DoT[]>((acc, aura) => {
      if (!("interval" in aura)) {
        return acc;
      }
      if (state.time > aura.expires) {
        return acc;
      }

      return [...acc, aura];
    }, []);
};
