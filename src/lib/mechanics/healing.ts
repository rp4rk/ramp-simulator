import { StateSpellReducer, SimState, Spell } from "../types";
import { getCritPerc, getVersPerc } from "../player";
import { createDivineAegisShield } from "../talents/DivineAegis";

/**
 * Returns a simulation state with the healing from the provided spell included
 *
 * Note: Critical strikes are treated as a standard increase and do not roll
 */
export const healing: StateSpellReducer = (state: SimState, spell: Spell): SimState => {
  if ("dot" in spell) return state;
  if (!spell.healing) return state;
  const initialHealing = typeof spell.healing === "function" ? spell.healing(state) : spell.healing;
  const { player } = state;

  const calculatedHealing =
    (initialHealing / 100) *
    getCritPerc(player) *
    getVersPerc(player) *
    player.spellpower;

  return createDivineAegisShield(calculatedHealing)(
    { ...state, healing: state.healing + calculatedHealing },
    spell
  );
};
