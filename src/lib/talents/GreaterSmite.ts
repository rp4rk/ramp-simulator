import { hasAura } from "lib/buff";
import { applyAura } from "lib/mechanics";
import { getAuraStacks, applyAuraStack } from "lib/mechanics/aura";
import { hasTalent } from "lib/talents";
import { Calculated, StateSpellReducer } from "lib/types";

// Midnight: Greater Smite - Casting Smite increases Smite damage by 15%, stacking 2 times, lasts 2s
const GREATER_SMITE_ID = 395002; // TODO: Replace with actual WoW talent ID
const GREATER_SMITE_BONUS_PER_STACK = 0.15;
const GREATER_SMITE_MAX_STACKS = 2;
const GREATER_SMITE_DURATION = 2000;
const GREATER_SMITE_BUFF_NAME = "Greater Smite";

/**
 * Buff function for buildCoefficient - reads current Greater Smite stacks
 */
export const greaterSmiteBuff: Calculated = (state) => {
  if (!hasTalent(state, GREATER_SMITE_ID)) return 1;
  if (!hasAura(state, GREATER_SMITE_BUFF_NAME)) return 1;

  const stacks = getAuraStacks(state, GREATER_SMITE_BUFF_NAME);
  return 1 + stacks * GREATER_SMITE_BONUS_PER_STACK;
};

/**
 * Effect to apply/stack the Greater Smite aura after casting Smite
 */
export const applyGreaterSmiteStack: StateSpellReducer = (state) => {
  if (!hasTalent(state, GREATER_SMITE_ID)) return state;

  const currentStacks = getAuraStacks(state, GREATER_SMITE_BUFF_NAME);

  if (hasAura(state, GREATER_SMITE_BUFF_NAME) && currentStacks < GREATER_SMITE_MAX_STACKS) {
    return applyAuraStack(state, GREATER_SMITE_BUFF_NAME, 1);
  }

  return applyAura(state, {
    name: GREATER_SMITE_BUFF_NAME,
    duration: GREATER_SMITE_DURATION,
    stacks: Math.min(currentStacks + 1, GREATER_SMITE_MAX_STACKS),
  });
};
