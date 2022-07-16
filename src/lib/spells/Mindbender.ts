import { PuppetMaster } from "lib/mechanics/PuppetMaster";
import { hasAura } from "../buff";
import { advanceTime, applyAura, atonement, damage, executeDoT } from "../mechanics";
import { Spell, SpellCategory } from "../types";

export const Mindbender: Spell = {
  category: SpellCategory.Cooldown,
  id: 123040,
  icon: "spell_shadow_soulleech_3",
  name: "Mindbender",
  damage: 33.88,
  effect: [
    (state) =>
      applyAura(state, {
        dot: true,
        name: "Mindbender",
        duration: 12000,
        applied: state.time,
        expires: state.time + 12000,
        interval: (state) => (hasAura(state, "Rabid Shadows") ? 1500 / 1.1 : 1500),
        ticks: 10,
        coefficient: 33.88,
      }),
    damage,
    atonement,
    executeDoT,
    advanceTime,
    PuppetMaster,
  ],
};
