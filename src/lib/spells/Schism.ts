import { advanceTime, applyAura, atonement, cooldown, damage } from "../mechanics";
import { Spell, SpellCategory } from "../types";
import { createManaCost } from "../mechanics/mana";
import { buildDamage } from "lib/mechanics/util/buildDamage";
import { applyTwilightEquilibriumHoly } from "../talents/TwilightEquilibrium";
import { StateSpellReducer } from "lib/types";
import {
  twilightEquilibriumBuff,
  TwilightEquilibriumSchool,
} from "lib/talents/TwilightEquilibrium";
import { hasTalent } from "lib/talents";

const MALICIOUS_INTENT_ID = 372969;
const MALICIOUS_INTENT_DURATION = 6000;

const applySchismBuff: StateSpellReducer = (state) => {
  const hasMaliciousIntent = hasTalent(state, MALICIOUS_INTENT_ID);

  return applyAura(state, {
    name: "Schism",
    duration: 9000 + (hasMaliciousIntent ? MALICIOUS_INTENT_DURATION : 0),
  });
};

export const Schism: Spell = {
  category: SpellCategory.Cooldown,
  id: 214621,
  icon: "spell_warlock_focusshadow",
  name: "Schism",
  cost: createManaCost(0.5),
  damage: buildDamage(141, [twilightEquilibriumBuff(TwilightEquilibriumSchool.Shadow)]),
  castTime: 1500,
  cooldown: 24000,
  effect: [cooldown, advanceTime, damage, atonement, applySchismBuff, applyTwilightEquilibriumHoly],
};
