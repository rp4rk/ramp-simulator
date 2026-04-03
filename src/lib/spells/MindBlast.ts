import { advanceTime, atonement, cooldown, damage } from "../mechanics";
import { Spell, SpellCategory } from "../types";
import { createManaCost } from "../mechanics/mana";
import { InescapableTorment } from "../talents/InescapableTorment";
import { Expiation, expiationBuff } from "../talents/Expiation";
import {
  TwilightEquilibriumSchool,
  twilightEquilibriumBuff,
} from "lib/talents/TwilightEquilibrium";
import { buildCoefficient } from "lib/mechanics/util/buildDamage";
import { applyTwilightEquilibriumHoly } from "../talents/TwilightEquilibrium";
import { getHastePerc } from "lib/player";
import { occultistBuff } from "../talents/Occultist";

export const MindBlast: Spell = {
  category: SpellCategory.Damage,
  id: 8092,
  icon: "spell_shadow_unholyfrenzy",
  name: "Mind Blast",
  cost: createManaCost(2.5),
  // Midnight: Mind Blast cooldown increased to 28s (from 24s recharge)
  cooldown: (state) => {
    const haste = getHastePerc(state.player);

    return 28000 / haste;
  },
  // Midnight: Mind Blast damage increased by 40%, Occultist passive
  damage: buildCoefficient(78.336 * 1.32 * 1.4, [
    twilightEquilibriumBuff(TwilightEquilibriumSchool.Shadow),
    expiationBuff,
    occultistBuff,
  ]),
  castTime: 1500,
  effect: [
    cooldown,
    advanceTime,
    damage,
    atonement,
    InescapableTorment,
    Expiation,
    applyTwilightEquilibriumHoly,
  ],
};
