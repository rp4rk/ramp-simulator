import { getTalentPoints } from "lib/talents";
import { Calculated } from "lib/types";

const BLAZE_OF_LIGHT_ID = 215768;
const BLAZE_OF_LIGHT_COEFFICIENT_PER_POINT = 0.075;

export const blazeOfLightBuff: Calculated = (state) => {
  return 1 + getTalentPoints(state, BLAZE_OF_LIGHT_ID) * BLAZE_OF_LIGHT_COEFFICIENT_PER_POINT;
};
