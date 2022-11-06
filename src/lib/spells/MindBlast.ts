import { advanceTime, atonement, damage } from "../mechanics";
import { Spell, SpellCategory } from "../types";
import { createManaCost } from "../mechanics/mana";
import { InescapableTorment } from "../talents/InescapableTorment";
import { Expiation, expiationBuff } from "../talents/Expiation";
import {
  TwilightEquilibriumSchool,
  twilightEquilibriumBuff,
} from "lib/talents/TwilightEquilibrium";
import { buildDamage } from "lib/mechanics/util/buildDamage";
import { applyTwilightEquilibriumHoly } from "../talents/TwilightEquilibrium";

export const MindBlast: Spell = {
  category: SpellCategory.Damage,
  id: 8092,
  icon: "spell_shadow_unholyfrenzy",
  name: "Mind Blast",
  cost: createManaCost(2.5),
  damage: buildDamage(78.336 * 1.32, [
    twilightEquilibriumBuff(TwilightEquilibriumSchool.Shadow),
    expiationBuff,
  ]),
  castTime: 1500,
  effect: [
    advanceTime,
    damage,
    atonement,
    InescapableTorment,
    Expiation,
    applyTwilightEquilibriumHoly,
  ],
};
