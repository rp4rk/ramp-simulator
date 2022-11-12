import { hasAura } from "../buff";
import { absorb, advanceTime, applyAura, cooldown, damage, healing } from "../mechanics";
import { getHastePerc } from "../player";
import { Spell, SpellCategory, SimState } from "../types";
import { createManaCost, MANA_COST_TYPE } from "../mechanics/mana";
import { ATONEMENT_BASE_DURATION } from "./Atonement";

import { RAPTURE_COEFFICIENT } from "./Rapture";
import { BorrowedTime } from "lib/talents/BorrowedTime";
import { hasTalent } from "lib/talents";

export const calculateShieldAbsorb = (state: SimState) => {
  const hasRaptureActive = hasAura(state, "Rapture");
  const raptureBonus = 1 + RAPTURE_COEFFICIENT;

  const shieldCoefficient = 336 * (hasRaptureActive ? raptureBonus : 1);

  return shieldCoefficient;
};

/**
 * Handle PWS Atonement (Indemnity)
 */
const INDEMNITY_ID = 373049;
const INDEMNITY_BONUS_DURATION = 2000;
export const applyPowerWordShieldAtonement = (state: SimState) => {
  const hasIndemnity = hasTalent(state, INDEMNITY_ID);

  return applyAura(state, {
    name: "Atonement",
    applied: state.time,
    duration: ATONEMENT_BASE_DURATION + (hasIndemnity ? INDEMNITY_BONUS_DURATION : 0),
  });
};

export const PowerWordShield: Spell = {
  category: SpellCategory.Applicator,
  id: 17,
  icon: "spell_holy_powerwordshield",
  metadata: ["Applicator"],
  cost: (state) => {
    const hasShieldDiscipline = hasAura(state, "Shield Discipline");
    const sdDiscount = hasShieldDiscipline ? 0.5 : 0;
    const initialCost = createManaCost(3.1 - sdDiscount)(state);

    return createManaCost(initialCost, MANA_COST_TYPE.ABSOLUTE)(state);
  },
  cooldown: (state) => {
    const haste = getHastePerc(state.player);
    const hasRapture = hasAura(state, "Rapture");

    return hasRapture ? 0 : 7500 / haste;
  },
  name: "Power Word: Shield",
  absorb: calculateShieldAbsorb,
  effect: [
    BorrowedTime,
    cooldown,
    absorb,
    healing,
    damage,
    applyPowerWordShieldAtonement,
    advanceTime,
  ],
};
