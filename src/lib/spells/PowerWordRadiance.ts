import { advanceTime, applyAura, healing } from "../mechanics";
import { Spell, SpellCategory } from "../types";
import { createManaCost } from "../mechanics/mana";

export const PowerWordRadiance: Spell = {
  category: SpellCategory.Applicator,
  id: 194509,
  icon: "spell_priest_powerword",
  name: "Power Word: Radiance",
  metadata: ["Applicator"],
  cost: createManaCost(6.5),
  healing: 1023.75,
  castTime: 2000,
  effect: [
    advanceTime,
    healing,
    (state) => {
      return applyAura(
        state,
        {
          name: "Atonement",
          applied: state.time,
          duration: 9000,
          expires: state.time + 9000,
        },
        5
      );
    },
  ],
};
