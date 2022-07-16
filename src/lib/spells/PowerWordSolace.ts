import { advanceTime, atonement, damage } from "../mechanics";
import { Spell, SpellCategory } from "../types";
import { createManaCost } from "../mechanics/mana";

export const PowerWordSolace: Spell = {
  category: SpellCategory.Cooldown,
  id: 129250,
  cost: createManaCost(-0.5),
  icon: "ability_priest_flashoflight",
  name: "Power Word: Solace",
  damage: 75.2,
  effect: [damage, atonement, advanceTime],
};
