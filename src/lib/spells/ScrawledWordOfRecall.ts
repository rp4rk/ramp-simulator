import { advanceTime } from "../mechanics";
import { Spell, SpellCategory } from "../types";

export const ScrawledWordOfRecall: Spell = {
  category: SpellCategory.Cooldown,
  id: 186425,
  icon: "inv_inscription_80_scroll",
  name: "Scrawled Word of Recall",
  fixedGcd: true,
  castTime: 500,
  effect: [
    advanceTime,
    (state) => {
      const penanceCooldownTimestamp = state.cooldowns.get("Penance");

      if (penanceCooldownTimestamp) {
        state.cooldowns.set("Penance", penanceCooldownTimestamp - 7200);
      }

      return state;
    },
  ],
};
