import { hasAura } from "lib/buff";
import { applyAura } from "lib/mechanics";
import { applyAuraStack, getAuraStacks } from "lib/mechanics/aura";
import { hasTalent } from "lib/talents";
import { StateSpellReducer } from "lib/types";
import { Calculated } from "../types";

const WEAL_AND_WOE_ID = 390786;
const WEAL_AND_WOE_SMITE_BONUS_PER_STACK = 0.12;
const WEAL_AND_WOE_POWER_WORD_SHIELD_BONUS_PER_STACK = 0.05;
const WEAL_AND_WOE_MAX_STACKS = 7;

/**
 * Handles application of Weal and Woe and stacking
 */
export const applyWealAndWoe: StateSpellReducer = (state) => {
  const hasWealAndWoe = hasTalent(state, WEAL_AND_WOE_ID);
  if (!hasWealAndWoe) return state;

  // Apply a fresh instance of Weal and Woe
  if (!hasAura(state, "Weal and Woe")) {
    return applyAura(state, {
      name: "Weal and Woe",
      stacks: 1,
      duration: 20_000,
    });
  }

  // Do not stack beyond 7
  if (getAuraStacks(state, "Weal and Woe") >= WEAL_AND_WOE_MAX_STACKS) {
    return state;
  }

  // Apply 1 stack of Weal and Woe
  return applyAuraStack(state, "Weal and Woe", 1);
};

/**
 * Gets the appropriate value for Smite based on the number of stacks of Weal and Woe
 */
export const wealAndWoeSmiteBuff: Calculated = (state) => {
  const hasWealAndWoe = hasTalent(state, WEAL_AND_WOE_ID);
  if (!hasWealAndWoe) return 1;

  const stacks = getAuraStacks(state, "Weal and Woe");
  return 1 + stacks * WEAL_AND_WOE_SMITE_BONUS_PER_STACK;
};

/**
 * Gets the appropriate value for Power Word: Shield based on the number of stacks of Weal and Woe
 */
export const wealAndWoePowerWordShieldBuff: Calculated = (state) => {
  const hasWealAndWoe = hasTalent(state, WEAL_AND_WOE_ID);
  if (!hasWealAndWoe) return 1;

  const stacks = getAuraStacks(state, "Weal and Woe");
  return 1 + stacks * WEAL_AND_WOE_POWER_WORD_SHIELD_BONUS_PER_STACK;
};
