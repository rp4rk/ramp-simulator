import { SimState, OverTime, CalculatedBuff, HoT } from "./types";

/**
 * Gets the most recent aura
 */
export const getAura = (state: SimState, name: string): CalculatedBuff | OverTime | undefined => {
  const buff = state.buffs.get(name)?.at(-1);
  if (!buff) return undefined;
  if (buff.consumed) return undefined;

  if (state.time >= buff.applied && state.time <= buff.expires) {
    return buff;
  }
};

// Note: Mutating
export const consumeAura =
  (name: string) =>
  (state: SimState): SimState => {
    const buff = getAura(state, name);
    if (buff) {
      buff.consumed = true;
    }
    return state;
  };

/**
 * Checks if a buff is active
 */
export const hasAura = (state: SimState, name: string): Boolean => {
  return !!getAura(state, name);
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
      if (curr.consumed) {
        return acc;
      }

      return [...acc, curr];
    }, []) || []
  );
};

/**
 * Gets buffs with stat effects
 */
export const getStatBuffs = (state: SimState): CalculatedBuff[] => {
  return Array.from(state.buffs.values())
    .flatMap((i) => i)
    .filter((buff) => "statBuff" in buff);
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
      if (aura.consumed) {
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
      if (aura.consumed) {
        return acc;
      }

      return [...acc, aura];
    }, []);
};
