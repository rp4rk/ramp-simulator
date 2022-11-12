import { advanceTime, atonement, damage, healing } from "lib/mechanics";
import { Spell, SpellCategory } from "lib/types";
import { createManaCost } from "lib/mechanics/mana";
import { buildCoefficient } from "lib/mechanics/util/buildDamage";
import {
  applyTwilightEquilibriumShadow,
  twilightEquilibriumBuff,
  TwilightEquilibriumSchool,
} from "lib/talents/TwilightEquilibrium";

export const Halo: Spell = {
  category: SpellCategory.Cooldown,
  id: 120517,
  icon: "ability_priest_halo",
  name: "Halo",
  cost: createManaCost(2.7),
  damage: buildCoefficient(144.2, [twilightEquilibriumBuff(TwilightEquilibriumSchool.Holy)]),
  healing: buildCoefficient(161 * (6 + 5.414), [
    twilightEquilibriumBuff(TwilightEquilibriumSchool.Holy), // Current behavior is that TE buffs healing here
  ]),
  castTime: 1500,
  effect: [advanceTime, healing, damage, atonement, applyTwilightEquilibriumShadow],
};
