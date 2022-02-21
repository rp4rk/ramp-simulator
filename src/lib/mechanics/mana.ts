import { hasAura } from "lib/buff";
import { StateSpellReducer, SimState, Spell, Calculated } from "../types";

export const BASE_MANA = 50_000;
export const ENCHANT_BONUS = 0.06;

export enum MANA_COST_TYPE {
  PERCENTAGE = "PERCENTAGE",
  ABSOLUTE = "ABSOLUTE",
}

export const createManaCost =
  (value: number, type = MANA_COST_TYPE.PERCENTAGE): Calculated =>
  (state) => {
    const normalizedValue = type === MANA_COST_TYPE.PERCENTAGE ? value / 100 : value;

    // Handle mana regens, which typically include eternal bounds
    if (type === MANA_COST_TYPE.PERCENTAGE && normalizedValue < 0) {
      const bonus = hasAura(state, "Eternal Bounds") ? ENCHANT_BONUS : 0;

      return BASE_MANA * (1 + bonus) * normalizedValue;
    }

    if (hasAura(state, "Innervate")) return 0;

    // Handle baseline mana costs
    if (type === MANA_COST_TYPE.PERCENTAGE) {
      return BASE_MANA * normalizedValue;
    }

    console.log();

    return normalizedValue;
  };

/**
 * Returns the simulation state with consideration for the mana cost of the spell cast
 *
 * Mana refunds are expressed as a negative value
 */
export const mana: StateSpellReducer = (state: SimState, spell: Spell): SimState => {
  if (!spell.cost) return state;

  if (typeof spell.cost === "function") {
    return {
      ...state,
      mana: state.mana + spell.cost(state),
    };
  }

  return { ...state, mana: state.mana + spell.cost };
};
