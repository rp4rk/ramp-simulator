import { hasAura, numBuffsActive } from "../buff";
import { advanceTime, atonement, damage } from "../mechanics";
import { Spell, SpellCategory } from "../types";
import { createManaCost } from "../mechanics/mana";

export const Smite: Spell = {
  category: SpellCategory.Damage,
  id: 585,
  icon: "spell_holy_holysmite",
  cost: createManaCost(0.4),
  name: "Smite",
  damage: (state) => {
    const COEFFICIENT = 49.7;
    const hasLessonsInHumility = hasAura(state, "Lessons in Humility");
    if (!hasLessonsInHumility) return COEFFICIENT;

    const smiteAmp = numBuffsActive(state, "Atonement") >= 3 ? 1.2 : 1;
    return smiteAmp * COEFFICIENT;
  },
  castTime: 1500,
  effect: [advanceTime, damage, atonement],
};
