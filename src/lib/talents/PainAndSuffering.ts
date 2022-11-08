import { getTalentPoints } from "lib/talents";
import { Calculated } from "../types";

const PAIN_AND_SUFFERING = 390689;
const PAIN_AND_SUFFERING_BONUS_PER_POINT = 0.075;

export const painAndSufferingBonus: Calculated = (state) => {
  const painAndSufferingPoints = getTalentPoints(state, PAIN_AND_SUFFERING);
  const painAndSufferingBonus = painAndSufferingPoints * PAIN_AND_SUFFERING_BONUS_PER_POINT;

  return 1 + painAndSufferingBonus;
};
