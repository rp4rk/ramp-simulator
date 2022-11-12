import { advanceTime, applyAura, atonement, damage, executeDoT } from "lib/mechanics";
import { Spell, SpellCategory } from "lib/types";
import { createManaCost } from "lib/mechanics/mana";
import { buildCoefficient } from "lib/mechanics/util/buildDamage";
import {
  applyTwilightEquilibriumShadow,
  twilightEquilibriumBuff,
  TwilightEquilibriumSchool,
} from "lib/talents/TwilightEquilibrium";
import { throesOfPainBonus } from "lib/talents/ThroesOfPain";
import { painAndSufferingBonus } from "../talents/PainAndSuffering";
import { revelInPurityBonus } from "lib/talents/RevelInPurity";

const PURGE_THE_WICKED_AURA_NERF = 0.94;
export const PurgeTheWicked: Spell = {
  category: SpellCategory.Damage,
  id: 204197,
  icon: "ability_mage_firestarter",
  name: "Purge the Wicked",
  damage: buildCoefficient(22.3 * PURGE_THE_WICKED_AURA_NERF, [
    twilightEquilibriumBuff(TwilightEquilibriumSchool.Holy),
    throesOfPainBonus,
    painAndSufferingBonus,
    revelInPurityBonus,
  ]),
  cost: createManaCost(1.8),
  effect: [
    (state, spell) => {
      const modifier = buildCoefficient(1, [
        twilightEquilibriumBuff(TwilightEquilibriumSchool.Holy),
        throesOfPainBonus,
        painAndSufferingBonus,
        revelInPurityBonus,
      ])(state, spell);

      return applyAura(state, {
        dot: true,
        name: "Purge the Wicked",
        duration: 20000,
        applied: state.time,
        expires: state.time + 20000,
        interval: 2000,
        ticks: 10,
        coefficient: 12.4 * PURGE_THE_WICKED_AURA_NERF * modifier,
      });
    },
    damage,
    atonement,
    executeDoT,
    applyTwilightEquilibriumShadow,
    advanceTime,
  ],
};
