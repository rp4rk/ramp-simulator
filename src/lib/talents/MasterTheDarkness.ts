import { hasAura } from "lib/buff";
import { applyAura } from "lib/mechanics";
import { hasTalent, getTalentPoints } from "lib/talents";
import { Calculated, StateSpellReducer, SimState } from "lib/types";

// Midnight: Master the Darkness - Apex talent (4 ranks)
// Rank 1: 30% chance after Penance for next PWS to become Void Shield (splashes to 2 additional allies)
// Ranks 2-3: Shadow Damage and Atonement healing increased by 3% per rank
// Rank 4: Void Shield reflects 25% damage taken to enemies, causing Atonement healing
const MASTER_THE_DARKNESS_ID = 395003; // TODO: Replace with actual WoW talent ID
const SHADOW_DAMAGE_BONUS_PER_RANK = 0.03;
const VOID_SHIELD_BUFF_NAME = "Void Shield Ready";

/**
 * Shadow damage and Atonement healing bonus from ranks 2-3
 */
export const masterTheDarknessBuff: Calculated = (state) => {
  const points = getTalentPoints(state, MASTER_THE_DARKNESS_ID);
  if (points <= 1) return 1;
  // Ranks 2-3 each give 3% shadow damage and atonement healing
  const bonusRanks = Math.min(points - 1, 2);
  return 1 + bonusRanks * SHADOW_DAMAGE_BONUS_PER_RANK;
};

/**
 * After Penance cast: apply Void Shield Ready buff (deterministic for sim purposes)
 * In live game this is 30% chance, but sim models it deterministically
 */
export const applyVoidShieldReady: StateSpellReducer = (state) => {
  if (!hasTalent(state, MASTER_THE_DARKNESS_ID)) return state;

  return applyAura(state, {
    name: VOID_SHIELD_BUFF_NAME,
    duration: 15_000,
  });
};

/**
 * Check if Void Shield should proc when PWS is cast
 */
export const isVoidShieldReady = (state: SimState): boolean => {
  return !!(hasTalent(state, MASTER_THE_DARKNESS_ID) && hasAura(state, VOID_SHIELD_BUFF_NAME));
};
