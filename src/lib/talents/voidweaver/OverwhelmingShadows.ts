import { hasTalent } from "lib/talents";
import { Calculated } from "lib/types";

// Voidweaver Hero Talent: Overwhelming Shadows
// Large Mind Blast damage modifier
const OVERWHELMING_SHADOWS_ID = 395031; // TODO: Replace with actual WoW talent ID
const OVERWHELMING_SHADOWS_BONUS = 0.2;

export const overwhelmingShadowsBuff: Calculated = (state) => {
  return hasTalent(state, OVERWHELMING_SHADOWS_ID) ? 1 + OVERWHELMING_SHADOWS_BONUS : 1;
};
