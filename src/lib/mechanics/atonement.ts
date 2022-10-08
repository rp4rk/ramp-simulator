import { StateSpellReducer, SimState } from "../types";
import { numBuffsActive } from "../buff";
import { calculateDamage } from "./damage";
import { getMasteryPerc } from "../player";

/**
 * Returns the simulation state with healing and absorbs from Atonement applied
 */
export const atonement: StateSpellReducer = (state, spell, tick): SimState => {
  const calculatedDamage = calculateDamage(state, spell, tick);
  const activeAtonementCount = numBuffsActive(state, "Atonement");
  const { player } = state;
  const mastery = getMasteryPerc(player);

  return {
    ...state,
    healing: state.healing + calculatedDamage * 0.5 * activeAtonementCount * mastery,
  };
};
