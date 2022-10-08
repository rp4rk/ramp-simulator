import { hasTalent } from "lib/talents";
import { absorb, advanceTime, atonement, damage, healing } from "../mechanics";
import { Spell, SpellCategory } from "../types";
import { cooldown } from "lib/mechanics";

const SHATTERED_PERCEPTIONS_ID = 391112;
const SHATTERED_PERCEPTIONS_BONUS = 0.25;
const COEFFICIENT = 300 * 0.85;

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
  damage: (state) => {
    const mgAmp = hasTalent(state, SHATTERED_PERCEPTIONS_ID) ? SHATTERED_PERCEPTIONS_BONUS : 1;

    return COEFFICIENT * mgAmp;
  },
  castTime: 1500,
  effect: [cooldown, advanceTime, damage, absorb, healing, atonement],
};
