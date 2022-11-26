import { advanceTime, atonement, damage, healing } from "lib/mechanics";
import { Spell, SpellCategory } from "lib/types";
import { createManaCost } from "lib/mechanics/mana";
import { buildCoefficient } from "lib/mechanics/util/buildDamage";
import {
  applyTwilightEquilibriumShadow,
  twilightEquilibriumBuff,
  TwilightEquilibriumSchool,
} from "lib/talents/TwilightEquilibrium";

export const DivineStar: Spell = {
  category: SpellCategory.Cooldown,
  id: 110744,
  icon: "spell_priest_divinestar",
  name: "Divine Star",
  cost: createManaCost(2),
  damage: buildCoefficient(56, [twilightEquilibriumBuff(TwilightEquilibriumSchool.Holy)]),
  healing: buildCoefficient(140 * (6 + 5.414), [
    twilightEquilibriumBuff(TwilightEquilibriumSchool.Holy),
  ]),
  effect: [advanceTime, healing, damage, atonement, applyTwilightEquilibriumShadow],
};
