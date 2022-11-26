import { advanceTime, atonement, damage, healing } from "lib/mechanics";
import { createManaCost } from "lib/mechanics/mana";
import { buildCoefficient } from "lib/mechanics/util/buildDamage";
import {
  twilightEquilibriumBuff,
  TwilightEquilibriumSchool,
} from "lib/talents/TwilightEquilibrium";
import { Spell, SpellCategory } from "lib/types";
import { applyTwilightEquilibriumHoly } from "./TwilightEquilibrium";

export const HolyNova: Spell = {
  id: 132157,
  name: "Holy Nova",
  icon: "spell_holy_holynova",
  cost: createManaCost(1.6),
  category: SpellCategory.Damage,
  healing: buildCoefficient(31.5 * (6 + 5.414), [
    twilightEquilibriumBuff(TwilightEquilibriumSchool.Holy), // Current behavior is that TE buffs healing here
  ]),
  damage: buildCoefficient(31.5, [twilightEquilibriumBuff(TwilightEquilibriumSchool.Holy)]),
  effect: [healing, damage, atonement, applyTwilightEquilibriumHoly, advanceTime],
};
