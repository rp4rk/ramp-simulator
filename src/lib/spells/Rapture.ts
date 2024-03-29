import { absorb, advanceTime, applyAura, damage, healing } from "../mechanics";
import { Spell, SpellCategory } from "../types";
import { createManaCost } from "../mechanics/mana";
import { hasTalent } from "../talents";
import { calculateShieldAbsorb, applyPowerWordShieldAtonement } from "./PowerWordShield";
import { cdr } from "lib/mechanics/cdr";
import { StateSpellReducer } from "../types";
import { applyWordsOfThePious } from "lib/talents/WordsOfThePious";
import { BorrowedTime } from "lib/talents/BorrowedTime";

export const RAPTURE_COEFFICIENT = 0.4;
export const POWER_WORD_SHIELD_COOLDOWN_MS = 7500;

export const resetPowerWordShieldCooldown: StateSpellReducer = (state, spell) => {
  return cdr("Power Word: Shield", POWER_WORD_SHIELD_COOLDOWN_MS)(state, spell);
};

export const Rapture: Spell = {
  category: SpellCategory.Cooldown,
  id: 47536,
  icon: "spell_holy_rapture",
  name: "Rapture",
  cost: createManaCost(3.1),
  absorb: calculateShieldAbsorb,
  effect: [
    applyWordsOfThePious,
    BorrowedTime,
    (state) =>
      applyAura(state, {
        name: "Rapture",
        applied: state.time,
        duration: (state) => {
          const hasExaltation = hasTalent(state, 373042);

          return 8000 + (hasExaltation ? 5000 : 0);
        },
      }),
    healing,
    damage,
    absorb,
    applyPowerWordShieldAtonement,
    advanceTime,
    resetPowerWordShieldCooldown,
  ],
};
