import { numBuffsActive } from "lib/buff";
import { getTalentPoints } from "lib/talents";
import { SimState } from "lib/types";

const SINS_OF_THE_MANY_ID = 280391;
const SINS_BONUS_PER_POINT = 0.06;

export const calculateSinsDamageBonus = (state: SimState): number => {
  const sinsPoints = getTalentPoints(state, SINS_OF_THE_MANY_ID);
  if (sinsPoints === 0) return 0;

  const sinsCap = sinsPoints * SINS_BONUS_PER_POINT;
  const sinsUnit = sinsCap / 12;
  const sinsFloor = sinsUnit * 3;
  const atonementCount = numBuffsActive(state, "Atonement");

  return Math.max(sinsFloor, sinsCap - atonementCount * sinsUnit);
};
