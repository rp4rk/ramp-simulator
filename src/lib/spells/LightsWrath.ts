import { hasAura, numBuffsActive } from "lib/buff";
import { advanceTime, applyAura, atonement, cooldown, damage } from "lib/mechanics";
import { getTalent, hasTalent } from "lib/talents";
import { Spell, SpellCategory } from "lib/types";
import {
  applyTwilightEquilibriumShadow,
  twilightEquilibriumBuff,
  TwilightEquilibriumSchool,
} from "../talents/TwilightEquilibrium";
import { Calculated } from "../types";
import { buildDamage } from "../mechanics/util/buildDamage";

const WRATH_UNLEASHED_ID = 390781;
const RESPLENDENT_LIGHT_ID = 390765;
const DAMAGE_COEFFICIENT = 175 * 0.94;
const STACK_BONUS = 0.1;
const STACK_BONUS_RL = 0.02;
const CAST_TIME = 2500;

export const LightsWrath: Spell = {
  id: 373178,
  name: "Light's Wrath",
  icon: "inv_staff_2h_artifacttome_d_01",
  category: SpellCategory.Cooldown,
  cooldown: 90_000,
  castTime: (state) => (hasTalent(state, WRATH_UNLEASHED_ID) ? 1500 : CAST_TIME),

  damage: (state, spell) => {
    const teMod = buildDamage(1, [twilightEquilibriumBuff(TwilightEquilibriumSchool.Holy)])(
      state,
      spell
    );
    const resplendentLight = getTalent(state, RESPLENDENT_LIGHT_ID);
    const resplendentLightBonus =
      resplendentLight && resplendentLight.points > 0
        ? resplendentLight.points * STACK_BONUS_RL
        : 0;

    const atonementCount = numBuffsActive(state, "Atonement");
    const atonementBonus = 1 + atonementCount * (STACK_BONUS + resplendentLightBonus);

    return DAMAGE_COEFFICIENT * atonementBonus * teMod;
  },

  effect: [
    cooldown,
    advanceTime,
    damage,
    atonement,
    (state) =>
      hasTalent(state, WRATH_UNLEASHED_ID)
        ? applyAura(state, {
            name: "Wrath Unleashed",
            applied: state.time,
            duration: 15_000,
          })
        : state,
    applyTwilightEquilibriumShadow,
  ],
};

export const unleashedWrathBuff: Calculated = (state) => {
  return hasAura(state, "Wrath Unleashed") ? 1.4 : 1;
};
