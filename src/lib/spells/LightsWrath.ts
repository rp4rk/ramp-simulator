import { numBuffsActive } from "../buff";
import { advanceTime, atonement, damage } from "../mechanics";
import { Spell, SpellCategory } from "../types";

export const LightsWrath: Spell = {
  category: SpellCategory.Cooldown,
  id: 373178,
  icon: "inv_staff_2h_artifacttome_d_01",
  name: "Light's Wrath",
  damage: (state) => {
    const atonementCount = numBuffsActive(state, "Atonement");
    const lwMultiplier = 0.1;

    return 175 * (1 + lwMultiplier * atonementCount);
  },
  castTime: 2500,
  effect: [advanceTime, damage, atonement],
};
