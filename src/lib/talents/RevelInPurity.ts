import { hasTalent } from "lib/talents";
import { Calculated } from "../types";

const REVEL_IN_PURITY_ID = 373003;
const REVEL_IN_PURITY_BONUS = 0.05;

export const revelInPurityBonus: Calculated = (state) => {
  const hasRevel = hasTalent(state, REVEL_IN_PURITY_ID);
  if (!hasRevel) return 1;

  return 1 + REVEL_IN_PURITY_BONUS;
};
