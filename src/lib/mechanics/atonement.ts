import { StateSpellReducer, SimState } from "../types";
import { numBuffsActive } from "../buff";
import { calculateDamage } from "./damage";
import { getMasteryPerc } from "../player";
import { createDivineAegisShield } from "../talents/DivineAegis";
import { getTalentPoints, hasTalent } from "lib/talents";

// Midnight: Atonement base transfer rate increased from 40% to 50%
const ATONEMENT_BASE_COEFFICIENT = 0.5;
// Midnight: Atonement healing starts diminishing above this many injured targets
const ATONEMENT_DR_THRESHOLD = 5;

const STOLEN_PSYCHE_ID = 373054;

/**
 * Returns the per-target Atonement transfer rate, accounting for Midnight diminishing returns.
 * At 5 or fewer injured targets: full 50% transfer per target.
 * Above 5: scales down so total throughput flattens. At 20 targets = ~22.5% per target.
 * Formula: rate = BASE * min(1, THRESHOLD / injuredCount)
 */
export function getAtonementTransferRate(injuredCount: number): number {
  if (injuredCount <= ATONEMENT_DR_THRESHOLD) return ATONEMENT_BASE_COEFFICIENT;
  // Scale down: at 10 targets = 25%, at 20 targets = 12.5%
  // But research shows 22.5% at full raid, so use a softer curve:
  // rate = BASE * (THRESHOLD / injuredCount) ^ 0.7
  const ratio = ATONEMENT_DR_THRESHOLD / injuredCount;
  return Math.max(0.225, ATONEMENT_BASE_COEFFICIENT * Math.pow(ratio, 0.7));
}

/**
 * Returns the simulation state with healing and absorbs from Atonement applied
 */
export const atonement: StateSpellReducer = (state, spell, tick): SimState => {
  const calculatedDamage = calculateDamage(state, spell, tick);
  const activeAtonementCount = numBuffsActive(state, "Atonement");
  const { player } = state;
  const mastery = getMasteryPerc(player);

  const stolenPsychePoints = getTalentPoints(state, STOLEN_PSYCHE_ID);
  const stolenPsycheBonus =
    spell.name === "Mind Blast" && hasTalent(state, STOLEN_PSYCHE_ID)
      ? 1 + 0.2 * stolenPsychePoints
      : 1;

  const transferRate = getAtonementTransferRate(activeAtonementCount);
  const calculatedHealing =
    calculatedDamage * transferRate * activeAtonementCount * mastery * stolenPsycheBonus;

  const wrathUnleashedBonus = spell.name === "Light's Wrath" && hasTalent(state, 390781) ? 0.15 : 0;

  return createDivineAegisShield(calculatedHealing, [wrathUnleashedBonus])(
    {
      ...state,
      healing: state.healing + calculatedHealing,
    },
    spell
  );
};
