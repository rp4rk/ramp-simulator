import { advanceTime, atonement, damage } from "../mechanics";
import { Spell, SpellCategory } from "../types";
import { createManaCost } from "../mechanics/mana";
import { InescapableTorment } from "../talents/InescapableTorment";
import { Expiation } from "../talents/Expiation";
import { getTalentPoints } from "lib/talents";
import { EXPIATION_ID, EXPIATION_DAMAGE_BONUS_PER_POINT } from "lib/talents/Expiation";

export const MindBlast: Spell = {
  category: SpellCategory.Damage,
  id: 8092,
  icon: "spell_shadow_unholyfrenzy",
  name: "Mind Blast",
  cost: createManaCost(2.5),
  damage: (state) =>
    78.336 * 1.32 * (1 + getTalentPoints(state, EXPIATION_ID) * EXPIATION_DAMAGE_BONUS_PER_POINT),
  castTime: 1500,
  effect: [advanceTime, damage, atonement, InescapableTorment, Expiation],
};
