import { StateSpellReducer, SimState, Spell } from "../types";
import { getCritPerc, getVersPerc } from "../player";

/**
 * Returns a simulation state with the absorb from the provided spell included
 *
 * Note: Critical strikes are treated as a standard increase and do not roll
 */
export const absorb: StateSpellReducer = (state: SimState, spell: Spell): SimState => {
  if ("interval" in spell) return state;
  if (!spell.absorb) return state;
  const { player } = state;
  const initialAbsorb = typeof spell.absorb === "function" ? spell.absorb(state) : spell.absorb;

  return {
    ...state,
    absorb: state.absorb + (initialAbsorb / 100) * player.spellpower * getCritPerc(player) * getVersPerc(player),
  };
};
