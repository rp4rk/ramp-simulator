import { atonement, advanceTime, damage } from "../mechanics";
import { Spell, SpellCategory } from "../types";
import { createManaCost } from "../mechanics/mana";
import { hasTalent } from "../talents";
import { InescapableTorment } from "lib/talents/InescapableTorment";
import { Expiation } from "lib/talents/Expiation";
import { buildDamage } from "lib/mechanics/util/buildDamage";
import { expiationBuff } from "../talents/Expiation";
import { applyTwilightEquilibriumHoly } from "../talents/TwilightEquilibrium";

export const ShadowWordDeath: Spell = {
  category: SpellCategory.Damage,
  id: 32379,
  icon: "spell_shadow_demonicfortitude",
  name: "Shadow Word: Death",
  cost: createManaCost(0.5),
  damage: buildDamage(79.9, [expiationBuff]),
  effect: [
    applyTwilightEquilibriumHoly,
    advanceTime,
    damage,
    atonement,
    InescapableTorment,
    Expiation,
  ],
  cooldown: 20000,
};

export const ShadowWordDeathExecute: Spell = {
  category: SpellCategory.Damage,
  id: 32379,
  icon: "spell_shadow_demonicfortitude",
  name: "Shadow Word: Death (Execute)",
  cost: createManaCost(0.5),
  damage: buildDamage(199.75, [expiationBuff]),
  effect: [
    applyTwilightEquilibriumHoly,
    advanceTime,
    damage,
    atonement,
    InescapableTorment,
    Expiation,
  ],
  cooldown: (state) => {
    const hasDeathAndMadness = hasTalent(state, 321291);

    return hasDeathAndMadness ? 0 : 20000;
  },
};
