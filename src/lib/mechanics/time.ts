import { log } from "./util/log";
import { SimState } from "../types";
import { getHastePerc } from "../player";

/**
 * Given the current simulation state and any spell, advance the simulation time
 */
export const advanceTime = log((state: SimState, spell): SimState => {
  if ("dot" in spell) return state;
  const playerHaste = getHastePerc(state.player);

  // Handle channel ticks
  if ("channel" in spell && spell.castTime) {
    return { ...state, time: Math.round(state.time + spell.castTime / playerHaste) };
  }

  // Handle spells with a fixed GCD, i.e. Word of Recall
  if (spell.fixedGcd && spell.castTime) {
    return { ...state, time: state.time + spell.castTime };
  }

  // Handle regular cast time spells
  if (!spell.fixedGcd && spell.castTime) {
    return {
      ...state,
      time: Math.max(Math.round(state.time + spell.castTime / playerHaste), 750),
    };
  }

  // Handle short GCD spells such as Ascended Nova
  if (spell.shortGcd) {
    return { ...state, time: state.time + Math.max(1000 / playerHaste, 750) };
  }

  // Handle spells that are off GCD
  if (spell.offGcd) {
    return state;
  }

  return { ...state, time: state.time + Math.max(1500 / playerHaste, 750) };
});
