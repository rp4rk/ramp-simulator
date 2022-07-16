import { advanceTime, atonement, damage, healing } from "../mechanics";
import { Spell, SpellCategory } from "../types";
import { createManaCost } from "../mechanics/mana";

export const Halo: Spell = {
  category: SpellCategory.Cooldown,
  id: 120517,
  icon: "ability_priest_halo",
  name: "Halo",
  cost: createManaCost(2.7),
  damage: 96.82,
  healing: 115 * (6 + 5.414),
  castTime: 1500,
  effect: [advanceTime, healing, damage, atonement],
};
