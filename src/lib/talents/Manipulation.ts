import { cdr } from "lib/mechanics/cdr";
import { getTalentPoints } from "lib/talents";
import { StateSpellReducer } from "../types";

const MANIPULATION_ID = 390996;
const MANIPULATION_CDR_PER_POINT = 500;

export const Manipulation: StateSpellReducer = (state, spell) => {
  const manipulationPoints = getTalentPoints(state, MANIPULATION_ID);
  if (manipulationPoints === 0) return state;
  const manipulationCdr = manipulationPoints * MANIPULATION_CDR_PER_POINT;

  return cdr("Mindgames", manipulationCdr)(state, spell);
};
