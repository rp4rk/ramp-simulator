import { applyAura } from "lib/mechanics";
import { hasTalent } from "lib/talents";
import { StateSpellReducer } from "lib/types";

// Voidweaver Hero Talent: Entropic Rift
// Casting Mind Blast creates a rift that deals damage to all enemies within.
// The rift grows in power as you cast Penance.
const ENTROPIC_RIFT_ID = 395030; // TODO: Replace with actual WoW talent ID
const ENTROPIC_RIFT_DURATION = 8000;
const ENTROPIC_RIFT_COEFFICIENT = 15; // Base damage per tick, TODO: validate

/**
 * Creates an Entropic Rift after casting Mind Blast (Voidweaver)
 */
export const createEntropicRift: StateSpellReducer = (state) => {
  if (!hasTalent(state, ENTROPIC_RIFT_ID)) return state;

  return applyAura(state, {
    dot: true,
    name: "Entropic Rift",
    duration: ENTROPIC_RIFT_DURATION,
    applied: state.time,
    expires: state.time + ENTROPIC_RIFT_DURATION,
    interval: 1000,
    ticks: 8,
    coefficient: ENTROPIC_RIFT_COEFFICIENT,
  });
};
