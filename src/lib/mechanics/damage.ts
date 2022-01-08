import { SimState, Spell, OverTime, StateSpellReducer } from "../types";
import { hasAura } from "../buff";
import { getCritPerc, getVersPerc } from "../player";

const IGNORED_FOR_SCHISM = ["Shadowfiend", "Mindbender"];

/**
 * Calculates the damage for the provided spell or OverTime effect with the provided simulation state.
 */
export function calculateDamage(state: SimState, spell: Spell | OverTime): number {
  const damage = "dot" in spell ? spell.coefficient : spell.damage;
  if (!damage) return 0;

  const initialDamage = typeof damage === "function" ? damage(state) : damage;

  const isSchismActive = hasAura(state, "Schism");
  const schismMultiplier = isSchismActive ? 1.25 : 1;

  const { player } = state;

  return (
    (initialDamage / 100) *
    (IGNORED_FOR_SCHISM.includes(spell.name) ? 1 : schismMultiplier) *
    player.spellpower *
    getCritPerc(player) *
    getVersPerc(player) *
    1.03
  );
}

/**
 * Returns simulation state with the damage of the provided spell applied
 */
export const damage: StateSpellReducer = (state, spell): SimState => {
  return {
    ...state,
    damage: state.damage + calculateDamage(state, spell),
  };
};
