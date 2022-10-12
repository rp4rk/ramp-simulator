import { cdr } from "lib/mechanics/cdr";
import { hasTalent } from "lib/talents";
import { StateSpellReducer } from "../types";

const TRAIN_OF_THOUGHT_ID = 390693;
const TRAIN_OF_THOUGHT_REDUCTION = 1000;
const TRAIN_OF_THOUGHT_SPELLS: { [key: string]: boolean } = {
  Renew: true,
  "Flash Heal": true,
};

export const TrainOfThought: StateSpellReducer = (state, spell) => {
  const hasTot = hasTalent(state, TRAIN_OF_THOUGHT_ID);
  if (!hasTot) return state;
  if (!TRAIN_OF_THOUGHT_SPELLS[spell.name]) return state;

  return cdr("Power Word: Shield", TRAIN_OF_THOUGHT_REDUCTION)(state, spell);
};
