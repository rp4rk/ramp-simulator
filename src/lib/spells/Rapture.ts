import { absorb, advanceTime, applyAura, damage, healing } from "../mechanics";
import { Spell, SpellCategory } from "../types";
import { createManaCost } from "../mechanics/mana";
import { hasTalent } from "../talents";
import { applyAtonement } from "./Atonement";
import { calculateShieldAbsorb } from "./PowerWordShield";

export const RAPTURE_COEFFICIENT = 0.3;

export const Rapture: Spell = {
  category: SpellCategory.Cooldown,
  id: 47536,
  icon: "spell_holy_rapture",
  name: "Rapture",
  cost: createManaCost(3.1),
  absorb: calculateShieldAbsorb,
  effect: [
    (state) =>
      applyAura(state, {
        name: "Rapture",
        applied: state.time,
        duration: (state) => {
          const hasExaltation = hasTalent(state, 373042);

          return 8000 + (hasExaltation ? 3000 : 0);
        },
      }),
    healing,
    damage,
    absorb,
    applyAtonement,
    advanceTime,
  ],
};
