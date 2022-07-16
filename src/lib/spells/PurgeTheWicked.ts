import { advanceTime, applyAura, atonement, damage, executeDoT } from "../mechanics";
import { Spell, SpellCategory } from "../types";
import { createManaCost } from "../mechanics/mana";

export const PurgeTheWicked: Spell = {
  category: SpellCategory.Damage,
  id: 204197,
  icon: "ability_mage_firestarter",
  name: "Purge the Wicked",
  damage: 22.3,
  cost: createManaCost(1.8),
  effect: [
    (state) =>
      applyAura(state, {
        dot: true,
        name: "Purge the Wicked",
        duration: 20000,
        applied: state.time,
        expires: state.time + 20000,
        interval: 2000,
        ticks: 10,
        coefficient: 11.656,
      }),
    damage,
    atonement,
    executeDoT,
    advanceTime,
  ],
};
