import { advanceTime, applyAura, atonement, damage, executeDoT } from "../mechanics";
import { Spell, SpellCategory } from "../types";
import { createManaCost } from "../mechanics/mana";

export const ShadowWordPain: Spell = {
  category: SpellCategory.Damage,
  id: 579,
  icon: "spell_shadow_shadowwordpain",
  name: "Shadow Word: Pain",
  damage: 12.92,
  cost: createManaCost(1.8),
  effect: [
    (state) =>
      applyAura(state, {
        dot: true,
        name: "Shadow Word: Pain",
        duration: 16000,
        applied: state.time,
        expires: state.time + 16000,
        interval: 2000,
        ticks: 8,
        coefficient: 9.588,
      }),
    damage,
    atonement,
    executeDoT,
    advanceTime,
  ],
};
