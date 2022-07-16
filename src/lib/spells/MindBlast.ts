import { hasAura } from "../buff";
import { absorb, advanceTime, atonement, cooldown, damage } from "../mechanics";
import { getHastePerc } from "../player";
import { Spell, SpellCategory } from "../types";
import { createManaCost } from "../mechanics/mana";
import { shadowFlamePrism } from "../mechanics/ShadowFlamePrism";

export const MindBlast: Spell = {
  category: SpellCategory.Damage,
  id: 8092,
  icon: "spell_shadow_unholyfrenzy",
  name: "Mind Blast",
  cost: createManaCost(3),
  cooldown: (state) => {
    const hastePerc = getHastePerc(state.player);
    const hasImprovedMindBlast = hasAura(state, "Improved Mind Blast");
    const baseCast = 15000 - (hasImprovedMindBlast ? 6000 : 0);

    return baseCast / hastePerc;
  },
  damage: 74.42,
  absorb: 300,
  castTime: 1500,
  effect: [cooldown, advanceTime, damage, absorb, shadowFlamePrism, atonement],
};
