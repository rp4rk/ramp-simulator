import { SimState, Spell, OverTime, StateSpellReducer, Channel } from "../types";
import { getCritPerc, getVersPerc } from "../player";
import { hasTalent } from "lib/talents";

// Midnight: All damage reduced by 15% baseline
const MIDNIGHT_BASE_DAMAGE_MODIFIER = 0.85;

/**
 * Calculates the damage for the provided spell or OverTime effect with the provided simulation state.
 */
export function calculateDamage(
  state: SimState,
  spell: Spell | OverTime | Channel,
  tick?: number
): number {
  const damage = "dot" in spell ? spell.coefficient : spell.damage;
  if (!damage) return 0;

  const initialDamage = typeof damage === "function" ? damage(state, spell, tick) : damage;

  const { player } = state;

  const wrathUnleashedBonus = spell.name === "Light's Wrath" && hasTalent(state, 390781) ? 0.15 : 0;

  return (
    (initialDamage / 100) *
    MIDNIGHT_BASE_DAMAGE_MODIFIER *
    player.spellpower *
    (getCritPerc(player) + wrathUnleashedBonus) *
    getVersPerc(player)
  );
}

/**
 * Returns simulation state with the damage of the provided spell applied
 */
export const damage: StateSpellReducer = (state, spell, tick?: number): SimState => {
  return {
    ...state,
    damage: state.damage + calculateDamage(state, spell, tick),
  };
};
