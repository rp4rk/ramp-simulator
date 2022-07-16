import { advanceTime, atonement, damage, healing } from "../mechanics";
import { Spell, SpellCategory } from "../types";
import { createManaCost } from "../mechanics/mana";
import { Wickedness } from "lib/mechanics/Wickedness";
import { hasAura } from "lib/buff";

export const DivineStar: Spell = {
  category: SpellCategory.Cooldown,
  id: 110744,
  icon: "spell_priest_divinestar",
  name: "Divine Star",
  cost: createManaCost(2),
  damage: (state) => (hasAura(state, "Wickedness") ? 56 * 1.1 : 56),
  healing: 140 * (6 + 5.414),
  effect: [healing, damage, atonement, Wickedness, advanceTime],
};
