import { hasAura } from "lib/buff";
import { applyAura } from "lib/mechanics";
import { hasTalent } from "lib/talents";
import { Calculated, StateSpellReducer } from "lib/types";

const WORDS_OF_THE_PIOUS_ID = 377438;
const WORDS_OF_THE_PIOUS_BONUS = 0.1;

export const wordsOfThePiousBuff: Calculated = (state) => {
  const hasWordsOfThePious = hasTalent(state, WORDS_OF_THE_PIOUS_ID);
  const hasWordsOfThePiousBuff = hasAura(state, "Words of the Pious");

  if (!hasWordsOfThePious || !hasWordsOfThePiousBuff) return 1;

  return 1 + WORDS_OF_THE_PIOUS_BONUS;
};

export const applyWordsOfThePious: StateSpellReducer = (state) => {
  const hasWordsOfThePious = hasTalent(state, WORDS_OF_THE_PIOUS_ID);
  if (!hasWordsOfThePious) return state;

  return applyAura(state, {
    name: "Words of the Pious",
    duration: 12000,
  });
};
