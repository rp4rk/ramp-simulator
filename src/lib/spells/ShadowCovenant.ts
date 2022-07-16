import { hasAura } from "../buff";
import { advanceTime, applyAura, cooldown, healing } from "../mechanics";
import { Spell, SpellCategory } from "../types";
import { createManaCost } from "../mechanics/mana";

export const ShadowCovenant: Spell = {
  category: SpellCategory.Cooldown,
  id: 314867,
  icon: "spell_shadow_summonvoidwalker",
  name: "Shadow Covenant",
  cost: createManaCost(4.5),
  healing: 825,
  cooldown: 30000,
  effect: [
    cooldown,
    (state) => {
      const hasEmbraceShadow = hasAura(state, "Embrace Shadow");
      const EMBRACE_SHADOW_INCREASE = 4000;

      return applyAura(state, {
        name: "Shadow Covenant",
        duration: hasEmbraceShadow ? 7000 + EMBRACE_SHADOW_INCREASE : 7000,
      });
    },
    advanceTime,
    healing,
  ],
};
