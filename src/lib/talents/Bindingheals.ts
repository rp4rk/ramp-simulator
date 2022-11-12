import { getPlayerAura } from "lib/buff";
import { cast, healing } from "lib/mechanics";
import { hasTalent } from "lib/talents";
import { Spell, SpellCategory, StateSpellReducer } from "lib/types";
import { applyAura } from "../mechanics/aura";
import { ATONEMENT_BASE_DURATION } from "../spells/Atonement";

const BINDING_HEALS_ID = 368275;

const _bindingHeal: Spell = {
  id: BINDING_HEALS_ID,
  name: "Binding Heal",
  icon: "spell_holy_bindingheal",
  category: SpellCategory.Ignored,
  offGcd: true,
  healing: 203 * 0.2, // todo: import from FH
  effect: [healing],
};

export const BindingHeals: StateSpellReducer = (state) => {
  if (!hasTalent(state, BINDING_HEALS_ID)) return state;
  const bindingHealState = cast(state, _bindingHeal);

  const existingAura = getPlayerAura(bindingHealState, "Atonement");
  if (existingAura) {
    existingAura.expires = bindingHealState.time + ATONEMENT_BASE_DURATION;
    return bindingHealState;
  }

  return applyAura(bindingHealState, {
    name: "Atonement",
    duration: ATONEMENT_BASE_DURATION,
    self: true,
  });
};
