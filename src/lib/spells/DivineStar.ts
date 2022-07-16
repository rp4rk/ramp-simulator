import { advanceTime, atonement, damage, healing } from "../mechanics";
import { Spell, SpellCategory } from "../types";
import { createManaCost } from "../mechanics/mana";

export const DivineStar: Spell = {
  category: SpellCategory.Cooldown,
  id: 110744,
  icon: "spell_priest_divinestar",
  name: "Divine Star",
  cost: createManaCost(2),
  damage: 56,
  healing: 140 * (6 + 5.414),
  effect: [advanceTime, healing, damage, atonement],
};
