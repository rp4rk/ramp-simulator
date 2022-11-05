import { atonement, advanceTime, damage } from "../mechanics";
import { Spell, SpellCategory } from "../types";
import { createManaCost } from "../mechanics/mana";
import { hasTalent, getTalentPoints } from "../talents";
import { InescapableTorment } from "lib/talents/InescapableTorment";
import { Expiation, EXPIATION_ID, EXPIATION_DAMAGE_BONUS_PER_POINT } from "lib/talents/Expiation";

export const ShadowWordDeath: Spell = {
  category: SpellCategory.Damage,
  id: 32379,
  icon: "spell_shadow_demonicfortitude",
  name: "Shadow Word: Death",
  cost: createManaCost(0.5),
  damage: (state) =>
    79.9 * (1 + getTalentPoints(state, EXPIATION_ID) * EXPIATION_DAMAGE_BONUS_PER_POINT),
  effect: [advanceTime, damage, atonement, InescapableTorment, Expiation],
  cooldown: 20000,
};

export const ShadowWordDeathExecute: Spell = {
  category: SpellCategory.Damage,
  id: 32379,
  icon: "spell_shadow_demonicfortitude",
  name: "Shadow Word: Death (Execute)",
  cost: createManaCost(0.5),
  damage: (state) =>
    199.75 * (1 + getTalentPoints(state, EXPIATION_ID) * EXPIATION_DAMAGE_BONUS_PER_POINT),
  effect: [advanceTime, damage, atonement, InescapableTorment, Expiation],
  cooldown: (state) => {
    const hasDeathAndMadness = hasTalent(state, 321291);

    return hasDeathAndMadness ? 0 : 20000;
  },
};
