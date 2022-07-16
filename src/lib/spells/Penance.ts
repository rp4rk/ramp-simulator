import { hasAura } from "../buff";
import { atonement, cooldown, damage, channel } from "../mechanics";
import { Channel, SpellCategory } from "../types";
import { createManaCost } from "../mechanics/mana";

export const Penance: Channel = {
  category: SpellCategory.Damage,
  channel: true,
  id: 47540,
  icon: "spell_holy_penance",
  name: "Penance",
  cost: (state) => {
    if (hasAura(state, "The Penitent One")) return 0;

    return createManaCost(1.6)(state);
  },
  cooldown: 9000,
  ticks: (state) => {
    const hasCastigation = hasAura(state, "Castigation");

    return 3 + (hasCastigation ? 1 : 0);
  },
  damage: (state, tick) => {
    const hasSwiftPenitence = hasAura(state, "Swift Penitence");
    const hasTilDawn = hasAura(state, "Til' Dawn");
    const spMultiplier = tick === 1 && hasSwiftPenitence ? 1.54 : 1;

    const multiplier = hasTilDawn ? 1.95 : 1;
    return 37.6 * multiplier * spMultiplier;
  },
  healing: 375,
  castTime: 2000,
  effect: [cooldown, channel([damage, atonement])],
};
