import { SimState, Spell, OverTime, StateSpellReducer, Channel } from "../types";
import { hasAura } from "../buff";
import { getCritPerc, getVersPerc } from "../player";

const IGNORED_FOR_SCHISM = ["Shadowfiend", "Mindbender"];
const CONSIDERED_FOR_SCOV: { [key: string]: boolean } = {
  Schism: true,
  Mindgames: true,
  "Shadow Word: Pain": true,
  "Mind Blast": true,
  "Mind Sear": true,
  "Shadow Mend": true,
  "Unholy Transfusion": true,
  "Unholy Nova": true,
};

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

  const initialDamage = typeof damage === "function" ? damage(state, tick) : damage;

  const isSchismActive = hasAura(state, "Schism");
  const isScovActive = hasAura(state, "Shadow Covenant");
  const schismMultiplier = isSchismActive ? 1.25 : 1;
  const scovMultiplier = isScovActive ? 1.25 : 1;

  const { player } = state;

  return (
    (initialDamage / 100) *
    (IGNORED_FOR_SCHISM.includes(spell.name) ? 1 : schismMultiplier) *
    (CONSIDERED_FOR_SCOV[spell.name] ? scovMultiplier : 1) *
    player.spellpower *
    getCritPerc(player) *
    getVersPerc(player) *
    1.03
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
