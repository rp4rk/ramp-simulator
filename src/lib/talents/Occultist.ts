import { hasTalent } from "lib/talents";
import { Calculated } from "lib/types";

// Midnight: Occultist replaces Shadow Covenant - passive 15% Shadow damage and healing increase
const OCCULTIST_ID = 395001; // TODO: Replace with actual WoW talent ID
const OCCULTIST_BONUS = 0.15;

export const occultistBuff: Calculated = (state) => {
  return hasTalent(state, OCCULTIST_ID) ? 1 + OCCULTIST_BONUS : 1;
};
