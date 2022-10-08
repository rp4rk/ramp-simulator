import { advanceTime, atonement, damage } from "../mechanics";
import { Spell, SpellCategory } from "../types";
import { createManaCost } from "../mechanics/mana";
import { hasAura } from "lib/buff";
import { Manipulation } from "lib/talents/Manipulation";

const DAMAGE_COEFFICIENT = 49.35;

export const Smite: Spell = {
  category: SpellCategory.Damage,
  id: 585,
  icon: "spell_holy_holysmite",
  cost: createManaCost(0.4),
  name: "Smite",
  damage: (state) =>
    hasAura(state, "Wrath Unleashed") ? DAMAGE_COEFFICIENT * 1.4 : DAMAGE_COEFFICIENT,
  castTime: 1500,
  effect: [advanceTime, damage, atonement, Manipulation],
};
