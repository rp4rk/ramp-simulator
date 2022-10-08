import { SimState } from "./types";

export interface TalentEntry {
  talentId: number;
  points: number;
}

/**
 * Get a talent entry
 */
export const getTalent = (state: SimState, talentId: number): TalentEntry | undefined => {
  return state.talents.get(talentId);
};

/**
 * Check if the player has a talent
 */
export const hasTalent = (state: SimState, talentId: number): boolean => {
  const talent = state.talents.get(talentId);

  return !!talent && talent?.points > 0;
};

/**
 * Check the point count of a specific talent
 */
export const getTalentPoints = (state: SimState, talentId: number): number => {
  const talent = state.talents.get(talentId);

  return talent?.points || 0;
};
