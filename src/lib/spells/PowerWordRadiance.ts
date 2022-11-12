import { advanceTime, applyAura, healing } from "../mechanics";
import { SimState, Spell, SpellCategory } from "../types";
import { createManaCost } from "../mechanics/mana";
import { ATONEMENT_BASE_DURATION } from "./Atonement";
import { hasTalent } from "lib/talents";

const ENDURING_LUMINESCENCE_ID = 390685;
const POWER_WORD_RADIANCE_ATONEMENT_DURATION = ATONEMENT_BASE_DURATION * 0.6;
const ENDURING_LUMINESCENCE_ATONEMENT_DURATION = ATONEMENT_BASE_DURATION * 0.7;

const applyPowerWordRadianceAtonement = (state: SimState) => {
  const hasEnduringLuminescence = hasTalent(state, ENDURING_LUMINESCENCE_ID);

  return applyAura(
    state,
    {
      name: "Atonement",
      applied: state.time,
      duration: hasEnduringLuminescence
        ? ENDURING_LUMINESCENCE_ATONEMENT_DURATION
        : POWER_WORD_RADIANCE_ATONEMENT_DURATION,
    },
    5
  );
};

export const PowerWordRadiance: Spell = {
  category: SpellCategory.Applicator,
  id: 194509,
  icon: "spell_priest_powerword",
  name: "Power Word: Radiance",
  metadata: ["Applicator"],
  cost: createManaCost(6.5),
  healing: 1023.75,
  castTime: 2000,
  effect: [advanceTime, healing, applyPowerWordRadianceAtonement],
};
