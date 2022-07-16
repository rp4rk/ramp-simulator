import { hasAura } from "../buff";
import { absorb, advanceTime, applyAura, damage, healing } from "../mechanics";
import { Spell, SpellCategory } from "../types";
import { createManaCost } from "../mechanics/mana";
import { applyAtonement } from "../mechanics/atonement";
import {
  calculateShieldAbsorb,
  calculateCrystallineReflection,
  calculateCrystallineReflectionDamage,
} from "lib/spells/PowerWordShield";

export const Rapture: Spell = {
  category: SpellCategory.Cooldown,
  id: 47536,
  icon: "spell_holy_rapture",
  name: "Rapture",
  cost: createManaCost(3.1),
  absorb: calculateShieldAbsorb,
  healing: calculateCrystallineReflection,
  damage: calculateCrystallineReflectionDamage,
  effect: [
    (state) =>
      applyAura(state, {
        name: "Rapture",
        applied: state.time,
        duration: (state) => {
          const hasExaltation = hasAura(state, "Exaltation");

          return 8000 + (hasExaltation ? 1000 : 0);
        },
      }),
    healing,
    damage,
    absorb,
    applyAtonement,
    advanceTime,
  ],
};
