import { StateSpellReducer, SimState } from "../types";
import { hasAura, getActiveBuffs } from "../buff";

/**
 * Returns a version of the simulation state with Atonements updated
 */
export const clarityOfMind: StateSpellReducer = (state, spell): SimState => {
  if (!hasAura(state, "Clarity of Mind")) return state;
  const atonements = getActiveBuffs(state, "Atonement");

  atonements.forEach((buff) => {
    buff.duration = buff.duration + 3000;
    buff.expires = buff.expires + 3000;
  });

  return state;
};
