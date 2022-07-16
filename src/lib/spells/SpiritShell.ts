import { applyAura } from "../mechanics";
import { Spell, SpellCategory } from "../types";
import { createManaCost } from "../mechanics/mana";

export const SpiritShell: Spell = {
  category: SpellCategory.Cooldown,
  id: 109964,
  icon: "ability_shaman_astralshift",
  name: "Spirit Shell",
  offGcd: true,
  cost: createManaCost(2),
  effect: [
    (state) => {
      const duration = 10000;

      return applyAura(state, {
        name: "Spirit Shell",
        duration,
        applied: state.time,
        expires: state.time + duration,
      });
    },
  ],
};
