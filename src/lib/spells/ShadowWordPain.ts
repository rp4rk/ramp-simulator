import { advanceTime, applyAura, atonement, damage, executeDoT } from "lib/mechanics";
import { Spell, SpellCategory } from "lib/types";
import { createManaCost } from "lib/mechanics/mana";
import { buildCoefficient } from "lib/mechanics/util/buildDamage";
import { throesOfPainBonus } from "lib/talents/ThroesOfPain";
import {
  twilightEquilibriumBuff,
  TwilightEquilibriumSchool,
  applyTwilightEquilibriumHoly,
} from "lib/talents/TwilightEquilibrium";
import { painAndSufferingBonus } from "lib/talents/PainAndSuffering";

export const ShadowWordPain: Spell = {
  category: SpellCategory.Damage,
  id: 579,
  icon: "spell_shadow_shadowwordpain",
  name: "Shadow Word: Pain",
  damage: buildCoefficient(12.92 * 1.01, [
    twilightEquilibriumBuff(TwilightEquilibriumSchool.Shadow),
    throesOfPainBonus,
    painAndSufferingBonus,
  ]),
  cost: createManaCost(1.8),
  effect: [
    (state, spell) => {
      const modifier = buildCoefficient(1, [
        twilightEquilibriumBuff(TwilightEquilibriumSchool.Shadow),
        throesOfPainBonus,
        painAndSufferingBonus,
      ])(state, spell);

      return applyAura(state, {
        dot: true,
        name: "Shadow Word: Pain",
        duration: 16000,
        applied: state.time,
        expires: state.time + 16000,
        interval: 2000,
        ticks: 8,
        coefficient: 9.588 * modifier * 1.01,
      });
    },
    damage,
    atonement,
    executeDoT,
    applyTwilightEquilibriumHoly,
    advanceTime,
  ],
};
