import { consumePlayerAura } from "lib/buff";
import { cast, healing } from "lib/mechanics";
import { hasTalent } from "lib/talents";
import { Spell, SpellCategory, StateSpellReducer } from "lib/types";
import { applyAura } from "../mechanics/aura";
import { ATONEMENT_BASE_DURATION } from "../spells/Atonement";
import { FlashHeal } from "lib/spells";

const BINDING_HEALS_ID = 368275;

const _bindingHeal: Spell = {
  id: BINDING_HEALS_ID,
  name: "Binding Heal",
  icon: "spell_holy_bindingheal",
  category: SpellCategory.Ignored,
  offGcd: true,
  healing: (typeof FlashHeal.healing === "number" && FlashHeal.healing * 0.2) || 0,
  effect: [healing],
};

export const BindingHeals: StateSpellReducer = (state) => {
  if (!hasTalent(state, BINDING_HEALS_ID)) return state;
  const bindingHealState = cast(state, _bindingHeal);
  const playerAtonementConsumedState = consumePlayerAura("Atonement")(bindingHealState);

  return applyAura(playerAtonementConsumedState, {
    name: "Atonement",
    duration: ATONEMENT_BASE_DURATION,
    self: true,
  });
};
