import { StateSpellReducer, SimState, Spell } from "../types";
import { hasAura } from "../buff";
import { getCritPerc, getVersPerc } from "../player";
import { createDivineAegisShield } from "../talents/DivineAegis";

const CONSIDERED_FOR_SCOV: { [key: string]: boolean } = {
  "Shadow Mend": true,
  "Unholy Transfusion": true,
  "Unholy Nova": true,
};

/**
 * Returns a simulation state with the healing from the provided spell included
 *
 * Note: Critical strikes are treated as a standard increase and do not roll
 */
export const healing: StateSpellReducer = (state: SimState, spell: Spell): SimState => {
  if ("dot" in spell) return state;
  if (!spell.healing) return state;
  const initialHealing = typeof spell.healing === "function" ? spell.healing(state) : spell.healing;
  const isScovActive = hasAura(state, "Shadow Covenant");
  const scovBonus = isScovActive ? 1.25 : 1;
  const { player } = state;

  const calculatedHealing =
    (initialHealing / 100) *
    getCritPerc(player) *
    getVersPerc(player) *
    player.spellpower *
    (CONSIDERED_FOR_SCOV[spell.name] ? scovBonus : 1);

  return createDivineAegisShield(calculatedHealing)(
    { ...state, healing: state.healing + calculatedHealing },
    spell
  );
};
