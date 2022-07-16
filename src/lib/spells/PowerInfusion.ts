import { applyAura } from "../mechanics";
import { Spell, SpellCategory, StatBuffType } from "../types";

export const PowerInfusion: Spell = {
  category: SpellCategory.Cooldown,
  id: 10060,
  icon: "spell_holy_powerinfusion",
  name: "Power Infusion",
  offGcd: true,
  effect: [
    (state) =>
      applyAura(state, {
        name: "Power Infusion",
        duration: 25000,
        statBuff: {
          amount: 0.25,
          stat: "haste",
          type: StatBuffType.MULTIPLICATIVE,
        },
      }),
  ],
};
