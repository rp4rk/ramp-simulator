import { consumeAura } from "../buff";
import { absorb, advanceTime, applyAura } from "../mechanics";
import { SimState, Spell, SpellCategory } from "../types";
import { createManaCost, MANA_COST_TYPE } from "../mechanics/mana";
import { ATONEMENT_BASE_DURATION } from "./Atonement";
import { calculateShieldAbsorb } from "./PowerWordShield";
import { hasTalent } from "lib/talents";

// Midnight: Void Shield - Upgraded Power Word: Shield from Master the Darkness
// Shields 3 allies total (self + 2 splashes) and applies Atonement to each
const INDEMNITY_ID = 373049;
const INDEMNITY_BONUS_DURATION = 2000;

const applyVoidShieldAtonements = (state: SimState) => {
  const hasIndemnity = hasTalent(state, INDEMNITY_ID);
  const duration = ATONEMENT_BASE_DURATION + (hasIndemnity ? INDEMNITY_BONUS_DURATION : 0);

  // Apply Atonement to 3 allies (the primary target + 2 splashes)
  return applyAura(
    state,
    {
      name: "Atonement",
      applied: state.time,
      duration,
    },
    3
  );
};

export const VoidShield: Spell = {
  category: SpellCategory.Applicator,
  id: 395010, // TODO: Replace with actual WoW spell ID
  icon: "spell_priest_void-shield",
  metadata: ["Applicator"],
  name: "Void Shield",
  // Void Shield has same cost as PWS
  cost: (state) => createManaCost(3.1)(state),
  absorb: (state) => {
    // Void Shield is stronger than regular PWS - apply to 3 targets
    const baseAbsorb = calculateShieldAbsorb(state);
    return baseAbsorb * 3;
  },
  effect: [
    absorb,
    applyVoidShieldAtonements,
    consumeAura("Void Shield Ready"),
    advanceTime,
  ],
};
