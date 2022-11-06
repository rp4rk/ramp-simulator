import { advanceTime, atonement, damage } from "../mechanics";
import { Spell, SpellCategory } from "../types";
import { createManaCost } from "../mechanics/mana";
import { Manipulation } from "lib/talents/Manipulation";
import {
  applyTwilightEquilibriumShadow,
  twilightEquilibriumBuff,
  TwilightEquilibriumSchool,
} from "../talents/TwilightEquilibrium";
import { buildDamage } from "lib/mechanics/util/buildDamage";
import { unleashedWrathBuff } from "./LightsWrath";

const DAMAGE_COEFFICIENT = 49.35;

export const Smite: Spell = {
  category: SpellCategory.Damage,
  id: 585,
  icon: "spell_holy_holysmite",
  cost: createManaCost(0.4),
  name: "Smite",
  damage: buildDamage(DAMAGE_COEFFICIENT, [
    twilightEquilibriumBuff(TwilightEquilibriumSchool.Holy),
    unleashedWrathBuff,
  ]),
  castTime: 1500,
  effect: [advanceTime, damage, atonement, Manipulation, applyTwilightEquilibriumShadow],
};
