import { absorb, advanceTime, atonement, damage, healing } from "../mechanics";
import { Spell, SpellCategory } from "../types";

export const Mindgames: Spell = {
  category: SpellCategory.Cooldown,
  id: 323673,
  icon: "ability_revendreth_priest",
  name: "Mindgames",
  absorb: 450,
  healing: 450,
  damage: 253.8,
  castTime: 1500,
  effect: [advanceTime, damage, absorb, healing, atonement],
};
