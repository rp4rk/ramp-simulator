import { StateSpellReducer, SimState } from "../types";
import { getActiveBuffs } from "../buff";

/**
 * Returns a version of the simulation state with Atonements updated
 */
export const evangelismExtension: StateSpellReducer = (state, spell): SimState => {
  const atonements = getActiveBuffs(state, "Atonement");

  atonements.forEach((buff) => {
    buff.duration = buff.duration + 6000;
    buff.expires = buff.expires + 6000;
  });

  return state;
};
