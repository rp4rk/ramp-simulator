import { applyAura } from "../mechanics";
import { Spell, SpellCategory, StatBuffType } from "../types";

export const Bloodlust: Spell = {
  category: SpellCategory.Cooldown,
  id: 2825,
  icon: "spell_nature_bloodlust",
  name: "Bloodlust",
  offGcd: true,
  effect: [
    (state) =>
      applyAura(state, {
        name: "Bloodlust",
        duration: 40000,
        statBuff: {
          amount: 0.3,
          stat: "haste",
          type: StatBuffType.MULTIPLICATIVE,
        },
      }),
  ],
};
