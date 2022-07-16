import { atonement, damage } from "../mechanics";
import { Spell, SpellCategory } from "../types";

export const ShadowFlamePrism: Spell = {
  category: SpellCategory.Ignored,
  id: 373427,
  uncastable: true,
  icon: "inv_jewelcrafting_shadowsongamethyst_02",
  name: "Shadowflame Prism",
  damage: 0.442 * 190,
  offGcd: true,
  effect: [damage, atonement],
};
