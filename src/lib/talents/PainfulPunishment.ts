import { extendOvertime } from "lib/mechanics";
import { hasTalent } from "lib/talents";
import { StateSpellReducer } from "lib/types";

const PAINFUL_PUNISHMENT_ID = 390686;
const PAINFUL_PUNISHMENT_EXTENSION = 700;

export const painfulPunishmentPtw: StateSpellReducer = (state, spell) => {
  const hasPainfulPunishment = hasTalent(state, PAINFUL_PUNISHMENT_ID);

  return extendOvertime(
    "Purge the Wicked",
    hasPainfulPunishment ? PAINFUL_PUNISHMENT_EXTENSION : 0
  )(state, spell);
};

export const painfulPunishmentSwp: StateSpellReducer = (state, spell) => {
  const hasPainfulPunishment = hasTalent(state, PAINFUL_PUNISHMENT_ID);

  return extendOvertime(
    "Purge the Wicked",
    hasPainfulPunishment ? PAINFUL_PUNISHMENT_EXTENSION : 0
  )(state, spell);
};
