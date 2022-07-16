import { hasAura } from "../buff";
import { advanceTime, applyAura, atonement, cooldown, damage } from "../mechanics";
import { Spell, SpellCategory } from "../types";
import { createManaCost } from "../mechanics/mana";

export const Schism: Spell = {
  category: SpellCategory.Cooldown,
  id: 214621,
  icon: "spell_warlock_focusshadow",
  name: "Schism",
  cost: createManaCost(0.5),
  damage: 141,
  castTime: 1500,
  cooldown: 24000,
  effect: [
    cooldown,
    advanceTime,
    damage,
    atonement,
    (state) => {
      return applyAura(state, {
        name: "Schism",
        duration: (state) => {
          const SCHISM_DURATION = 9000;
          const MS_BONUS = 1.5;
          const hasMaliciousScission = hasAura(state, "Malicious Scission");

          return hasMaliciousScission ? SCHISM_DURATION * MS_BONUS : SCHISM_DURATION;
        },
      });
    },
  ],
};
