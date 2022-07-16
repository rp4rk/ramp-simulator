import { hasAura } from "../buff";
import { advanceTime, healing } from "../mechanics";
import { Spell, SpellCategory } from "../types";
import { createManaCost, MANA_COST_TYPE } from "../mechanics/mana";
import { applyAtonement } from "../mechanics/atonement";

export const Shadowmend: Spell = {
  category: SpellCategory.Applicator,
  id: 136202,
  icon: "spell_shadow_shadowmend",
  name: "Shadow Mend",
  metadata: ["Applicator"],
  cost: (state) => {
    const hasAmalgams = hasAura(state, "Amalgam's Seventh Spine");
    const amDiscount = hasAmalgams ? 263 : 0; // https://ptr.wowhead.com/spell=215266/fragile-echoes @ 272
    const initialCost = createManaCost(3.5)(state) - amDiscount;

    return createManaCost(initialCost, MANA_COST_TYPE.ABSOLUTE)(state);
  },
  healing: 320,
  castTime: 1500,
  effect: [advanceTime, healing, applyAtonement],
};
