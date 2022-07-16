import { advanceTime, cooldown, damage } from "../mechanics";
import { Spell, SpellCategory } from "../types";
import { createManaCost } from "../mechanics/mana";
import { shadowFlamePrism } from "../mechanics/ShadowFlamePrism";

export const ShadowWordDeath: Spell = {
  category: SpellCategory.Damage,
  id: 32379,
  icon: "spell_shadow_demonicfortitude",
  name: "Shadow Word: Death",
  cost: createManaCost(0.5),
  damage: 85,
  effect: [cooldown, damage, shadowFlamePrism, advanceTime],
};
