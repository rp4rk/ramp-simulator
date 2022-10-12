import { StateSpellReducer, SimState } from "../types";
import { numBuffsActive } from "../buff";
import { calculateDamage } from "./damage";
import { getMasteryPerc } from "../player";
import { createDivineAegisShield } from "../talents/DivineAegis";
import { hasTalent } from "lib/talents";

const ATONEMENT_COEFFICIENT = 0.5;

/**
 * Returns the simulation state with healing and absorbs from Atonement applied
 */
export const atonement: StateSpellReducer = (state, spell, tick): SimState => {
  const calculatedDamage = calculateDamage(state, spell, tick);
  const activeAtonementCount = numBuffsActive(state, "Atonement");
  const { player } = state;
  const mastery = getMasteryPerc(player);

  const calculatedHealing =
    calculatedDamage * ATONEMENT_COEFFICIENT * activeAtonementCount * mastery;

  const wrathUnleashedBonus = spell.name === "Light's Wrath" && hasTalent(state, 390781) ? 0.15 : 0;

  return createDivineAegisShield(calculatedHealing, [wrathUnleashedBonus])(
    {
      ...state,
      healing: state.healing + calculatedHealing,
    },
    spell
  );
};
