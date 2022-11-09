import { applyAura } from "lib/mechanics";
import { applyStats } from "lib/mechanics/applyStats";
import { getTalentPoints } from "lib/talents";
import { StatBuffType, StateSpellReducer } from "lib/types";

const BORROWED_TIME_ID = 390691;
const BORROWED_TIME_BONUS_PER_POINT = 0.04;

export const BorrowedTime: StateSpellReducer = (state, spell) => {
  const borrowedTimePoints = getTalentPoints(state, BORROWED_TIME_ID);
  if (borrowedTimePoints === 0) return state;

  return applyStats(
    applyAura(state, {
      name: "Borrowed Time",
      duration: 4000,
      statBuff: {
        amount: borrowedTimePoints * BORROWED_TIME_BONUS_PER_POINT,
        stat: "haste",
        type: StatBuffType.MULTIPLICATIVE,
      },
    }),
    spell
  );
};
