import { hasAura } from "../buff";
import { absorb, advanceTime, cooldown, damage, healing } from "../mechanics";
import { getHastePerc } from "../player";
import { Spell, SpellCategory, SimState } from "../types";
import { createManaCost, MANA_COST_TYPE } from "../mechanics/mana";
import { applyAtonement } from "./Atonement";

import { RAPTURE_COEFFICIENT } from "./Rapture";
import { BorrowedTime } from "lib/talents/BorrowedTime";

export const calculateShieldAbsorb = (state: SimState) => {
  const hasRaptureActive = hasAura(state, "Rapture");
  const raptureBonus = 1 + RAPTURE_COEFFICIENT;

  const shieldCoefficient = 3.36 * (hasRaptureActive ? raptureBonus : 1);

  return shieldCoefficient;
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
  effect: [BorrowedTime, cooldown, absorb, healing, damage, applyAtonement, advanceTime],
};
