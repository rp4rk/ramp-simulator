import { getTalentPoints } from "lib/talents";
import { Calculated } from "../types";

const THROES_OF_PAIN_ID = 377422;
const THROES_OF_PAIN_BONUS_PER_POINT = 0.025;

export const throesOfPainBonus: Calculated = (state) => {
  const throesPoints = getTalentPoints(state, THROES_OF_PAIN_ID);
  const throesBonus = throesPoints * THROES_OF_PAIN_BONUS_PER_POINT;

  return 1 + throesBonus;
};
