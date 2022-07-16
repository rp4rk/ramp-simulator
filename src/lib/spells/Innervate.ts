import { applyAura } from "../mechanics";
import { Spell, SpellCategory } from "../types";

export const Innervate: Spell = {
  category: SpellCategory.Cooldown,
  id: 29166,
  icon: "spell_nature_lightning",
  name: "Innervate",
  offGcd: true,
  effect: [
    (state) =>
      applyAura(state, {
        name: "Innervate",
        duration: 10000,
      }),
  ],
};
