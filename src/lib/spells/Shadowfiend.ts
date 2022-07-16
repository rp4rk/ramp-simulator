import { hasAura } from "../buff";
import { advanceTime, applyAura, atonement, damage, executeDoT } from "../mechanics";
import { Spell, SpellCategory } from "../types";
import { PuppetMaster } from "../mechanics/PuppetMaster";

export const Shadowfiend: Spell = {
  category: SpellCategory.Cooldown,
  id: 34433,
  icon: "spell_shadow_shadowfiend",
  name: "Shadowfiend",
  damage: 46.2,
  effect: [
    (state) =>
      applyAura(state, {
        dot: true,
        name: "Shadowfiend",
        duration: 15000,
        applied: state.time,
        expires: state.time + 15000,
        interval: (state) => (hasAura(state, "Rabid Shadows") ? 1150 : 1500),
        ticks: 10,
        coefficient: 46.2,
      }),
    damage,
    atonement,
    executeDoT,
    advanceTime,
    PuppetMaster,
  ],
};
