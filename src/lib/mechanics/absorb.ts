import { StateSpellReducer, SimState, Spell } from "../types";
import { getCritPerc, getVersPerc } from "../player";
import { getTalentPoints } from "lib/talents";
import {
  DIVINE_AEGIS_ID,
  DIVINE_AEGIS_BENEFIT_PER_POINT,
  calculateCritContribution,
} from "../talents/DivineAegis";

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

  /**
   * Aegis of Wrath hackery
   */
  const critPerc = getCritPerc(state.player);
  const aegisPoints = getTalentPoints(state, DIVINE_AEGIS_ID);
  const aegisBenefit = aegisPoints * DIVINE_AEGIS_BENEFIT_PER_POINT;
  const critContribution = calculateCritContribution(critPerc);
  const totalCritBonus = 1 - critContribution + critContribution * (1 + aegisBenefit);

  return {
    ...state,
    absorb:
      state.absorb +
      (initialAbsorb / 100) * player.spellpower * totalCritBonus * getVersPerc(player),
  };
};
