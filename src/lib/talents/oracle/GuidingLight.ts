import { hasTalent } from "lib/talents";
import { Calculated } from "lib/types";

// Oracle Hero Talent: Guiding Light - Provides an additional charge of Penance
// Modeled in sim as a reduced effective cooldown (since we don't track charges)
const GUIDING_LIGHT_ID = 395020; // TODO: Replace with actual WoW talent ID

/**
 * Guiding Light effectively halves Penance's cooldown by providing an extra charge.
 * In the sim, this is modeled as a cooldown reduction factor.
 */
export const guidingLightCooldownMultiplier = (state: any): number => {
  return hasTalent(state, GUIDING_LIGHT_ID) ? 0.5 : 1;
};
