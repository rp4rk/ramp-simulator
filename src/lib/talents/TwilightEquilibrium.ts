import { consumeAura, hasAura } from "lib/buff";
import { applyAura } from "lib/mechanics";
import { hasTalent } from "lib/talents";
import { Calculated, StateSpellReducer } from "../types";

export const TWILIGHT_EQUILIBRIUM_ID = 390705;
export const TWILIGHT_EQUILIBRIUM_BONUS = 0.15;
export enum TwilightEquilibriumSchool {
  Holy = "Holy",
  Shadow = "Shadow",
}

const TWILIGHT_EQUILIBRIUM_HOLY_BUFF = "Twilight Equilibrium (Holy)";
const TWILIGHT_EQUILIBRIUM_SHADOW_BUFF = "Twilight Equilibrium (Shadow)";

export const twilightEquilibriumBuff =
  (school: TwilightEquilibriumSchool): Calculated =>
  (state) => {
    const hasTwilightEquilibrium = hasTalent(state, TWILIGHT_EQUILIBRIUM_ID);
    if (!hasTwilightEquilibrium) return 1;

    if (
      school === TwilightEquilibriumSchool.Holy &&
      hasAura(state, TWILIGHT_EQUILIBRIUM_HOLY_BUFF)
    ) {
      return 1 + TWILIGHT_EQUILIBRIUM_BONUS;
    }

    if (
      school === TwilightEquilibriumSchool.Shadow &&
      hasAura(state, TWILIGHT_EQUILIBRIUM_SHADOW_BUFF)
    ) {
      return 1 + TWILIGHT_EQUILIBRIUM_BONUS;
    }

    return 1;
  };

/**
 * Applied by Shadow school spells
 */
export const applyTwilightEquilibriumHoly: StateSpellReducer = (state, spell) => {
  const hasTwilightEquilibrium = hasTalent(state, TWILIGHT_EQUILIBRIUM_ID);
  if (!hasTwilightEquilibrium) return state;

  return applyAura(consumeAura(TWILIGHT_EQUILIBRIUM_SHADOW_BUFF)(state), {
    name: TWILIGHT_EQUILIBRIUM_HOLY_BUFF,
    duration: 6000,
    expires: state.time + 6000,
    applied: state.time,
  });
};

/**
 * Applied by Holy school spells
 */
export const applyTwilightEquilibriumShadow: StateSpellReducer = (state, spell) => {
  const hasTwilightEquilibrium = hasTalent(state, TWILIGHT_EQUILIBRIUM_ID);
  if (!hasTwilightEquilibrium) return state;

  return applyAura(consumeAura(TWILIGHT_EQUILIBRIUM_HOLY_BUFF)(state), {
    name: TWILIGHT_EQUILIBRIUM_SHADOW_BUFF,
    duration: 6000,
    expires: state.time + 6000,
    applied: state.time,
  });
};
