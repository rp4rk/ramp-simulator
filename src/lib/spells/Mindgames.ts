import { hasTalent } from "lib/talents";
import { absorb, advanceTime, atonement, damage, healing } from "../mechanics";
import { Spell, SpellCategory, SimState } from "../types";
import { cooldown } from "lib/mechanics";
import { buildCoefficient } from "../mechanics/util/buildDamage";
import { applyTwilightEquilibriumHoly } from "../talents/TwilightEquilibrium";
import {
  twilightEquilibriumBuff,
  TwilightEquilibriumSchool,
} from "lib/talents/TwilightEquilibrium";

const SHATTERED_PERCEPTIONS_ID = 391112;
const SHATTERED_PERCEPTIONS_BONUS = 0.25;
const COEFFICIENT = 225 * 0.57;

export const Mindgames: Spell = {
  category: SpellCategory.Cooldown,
  id: 323673,
  icon: "ability_revendreth_priest",
  name: "Mindgames",
  cooldown: 45_000,
  absorb: (state) => {
    const mgAmp = hasTalent(state, SHATTERED_PERCEPTIONS_ID) ? SHATTERED_PERCEPTIONS_BONUS : 1;

    return 300 * mgAmp;
  },
  healing: (state) => {
    const mgAmp = hasTalent(state, SHATTERED_PERCEPTIONS_ID) ? SHATTERED_PERCEPTIONS_BONUS : 1;

    return 300 * mgAmp;
  },
  damage: buildCoefficient(COEFFICIENT, [
    twilightEquilibriumBuff(TwilightEquilibriumSchool.Shadow),
    (state: SimState) =>
      hasTalent(state, SHATTERED_PERCEPTIONS_ID) ? 1 + SHATTERED_PERCEPTIONS_BONUS : 1,
  ]),
  castTime: 1500,
  effect: [cooldown, advanceTime, damage, absorb, healing, atonement, applyTwilightEquilibriumHoly],
};
