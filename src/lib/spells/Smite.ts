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
import { TrainOfThoughtPenance } from "lib/talents/TrainOfThought";
import { blazeOfLightBuff } from "../talents/BlazeOfLight";
import { wordsOfThePiousBuff } from "lib/talents/WordsOfThePious";
import { wealAndWoeSmiteBuff } from "../talents/WealAndWoe";
import { consumeAura } from "lib/buff";
import { applyHarshDisciplineStack, applyHarshDiscipline } from "../talents/HarshDiscipline";
import { hasTalent } from "lib/talents";

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
    blazeOfLightBuff,
    wordsOfThePiousBuff,
    wealAndWoeSmiteBuff,
  ]),
  castTime: (state) => (hasTalent(state, 373456) ? 1500 / 1.1 : 1500),
  effect: [
    advanceTime,
    applyHarshDisciplineStack,
    applyHarshDiscipline,
    damage,
    atonement,
    Manipulation,
    applyTwilightEquilibriumShadow,
    TrainOfThoughtPenance,
    consumeAura("Weal and Woe"),
  ],
};
