import { StateSpellReducer, SimState, Spell } from "../types";
import { hasAura } from "../buff";
import { getCritPerc, getVersPerc } from "../player";

/**
 * Returns a simulation state with the healing from the provided spell included
 *
 * Note: Critical strikes are treated as a standard increase and do not roll
 */
export const healing: StateSpellReducer = (state: SimState, spell: Spell): SimState => {
  if ("hot" in spell) return state;
  if ("dot" in spell) return state;
  if (!spell.healing) return state;
  const initialHealing = typeof spell.healing === "function" ? spell.healing(state) : spell.healing;
  const spiritShellActive = hasAura(state, "Spirit Shell");
  const { player } = state;

  const calculatedHealing = (initialHealing / 100) * getCritPerc(player) * getVersPerc(player) * player.spellpower;

  // TODO: Move this out of the healing reducer lol
  if (spell.name === "Power Word: Radiance" && spiritShellActive) {
    const shellAmount = calculatedHealing * 0.864;

    return {
      ...state,
      absorb: state.absorb + shellAmount,
    };
  }

  return { ...state, healing: state.healing + calculatedHealing };
};
