import { advanceTime, healing } from "lib/mechanics";
import { createManaCost } from "lib/mechanics/mana";
import { Spell, SpellCategory } from "../types";
import { applyAtonement } from "./Atonement";
import { TrainOfThought } from "lib/talents/TrainOfThought";

export const FlashHeal: Spell = {
  id: 2061,
  name: "Flash Heal",
  icon: "spell_holy_flashheal",
  category: SpellCategory.Applicator,
  metadata: ["Applicator"],
  cost: createManaCost(3.6),
  healing: 203,
  effect: [advanceTime, healing, applyAtonement, TrainOfThought],
};
