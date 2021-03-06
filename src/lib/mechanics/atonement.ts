import { StateSpellReducer, SimState } from "../types";
import { hasAura, numBuffsActive } from "../buff";
import { calculateDamage } from "./damage";
import { getMasteryPerc } from "../player";

/**
 * Returns the simulation state with healing and absorbs from Atonement applied
 */
export const atonement: StateSpellReducer = (state, spell, tick): SimState => {
  const spiritShellActive = hasAura(state, "Spirit Shell");
  const calculatedDamage = calculateDamage(state, spell, tick);
  const activeAtonementCount = numBuffsActive(state, "Atonement");
  const { player } = state;
  const mastery = getMasteryPerc(player);

  if (spiritShellActive) {
    const shellAmount = calculatedDamage * 0.5 * 0.864 * activeAtonementCount * mastery;

    return {
      ...state,
      absorb: state.absorb + shellAmount,
    };
  }

  return {
    ...state,
    healing: state.healing + calculatedDamage * 0.5 * activeAtonementCount * mastery,
  };
};
