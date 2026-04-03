import { advanceTime, atonement, damage } from "../mechanics";
import { Spell, SpellCategory } from "../types";
import { createManaCost } from "../mechanics/mana";
import { buildCoefficient } from "lib/mechanics/util/buildDamage";
import {
  twilightEquilibriumBuff,
  TwilightEquilibriumSchool,
  applyTwilightEquilibriumShadow,
} from "../talents/TwilightEquilibrium";
import { occultistBuff } from "../talents/Occultist";

// Midnight: Void Blast - Replaces Smite during Entropic Rift (Voidweaver)
// Significantly more powerful than Smite
const VOID_BLAST_COEFFICIENT = 85; // ~72% stronger than Smite's 49.35, TODO: validate

export const VoidBlast: Spell = {
  category: SpellCategory.Damage,
  id: 395040, // TODO: Replace with actual WoW spell ID
  icon: "spell_priest_void-blast",
  cost: createManaCost(0.4),
  name: "Void Blast",
  damage: buildCoefficient(VOID_BLAST_COEFFICIENT, [
    twilightEquilibriumBuff(TwilightEquilibriumSchool.Shadow),
    occultistBuff,
  ]),
  castTime: 1500,
  effect: [advanceTime, damage, atonement, applyTwilightEquilibriumShadow],
};
