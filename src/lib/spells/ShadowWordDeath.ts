import { atonement, advanceTime, damage } from "../mechanics";
import { Spell, SpellCategory } from "../types";
import { createManaCost } from "../mechanics/mana";
import { hasTalent } from "../talents";

export const ShadowWordDeath: Spell = {
  category: SpellCategory.Damage,
  id: 32379,
  icon: "spell_shadow_demonicfortitude",
  name: "Shadow Word: Death",
  cost: createManaCost(0.5),
  damage: 79.9,
  effect: [advanceTime, damage, atonement],
  cooldown: 20000,
};

export const ShadowWordDeathExecute: Spell = {
  category: SpellCategory.Damage,
  id: 32379,
  icon: "spell_shadow_demonicfortitude",
  name: "Shadow Word: Death (Execute)",
  cost: createManaCost(0.5),
  damage: 199.75,
  effect: [advanceTime, damage, atonement],
  cooldown: (state) => {
    const hasDeathAndMadness = hasTalent(state, 321291);

    return hasDeathAndMadness ? 0 : 20000;
  },
};
