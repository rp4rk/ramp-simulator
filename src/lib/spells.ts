import { hasAura } from "./buff";
import {
  advanceTime,
  applyAura,
  atonement,
  cooldown,
  damage,
  executeDoT,
  healing,
  evangelismExtension,
  channel,
} from "./mechanics";
import { Channel, Spell, SpellCategory, StatBuffType } from "./types";
import { createManaCost } from "./mechanics/mana";
import { Manipulation } from "./talents/Manipulation";
import { InescapableTorment } from "./talents/InescapableTorment";
import { Expiation } from "./talents/Expiation";

const PURGE_THE_WICKED_AURA_NERF = 0.94;
export const PurgeTheWicked: Spell = {
  category: SpellCategory.Damage,
  id: 204197,
  icon: "ability_mage_firestarter",
  name: "Purge the Wicked",
  damage: 22.3 * PURGE_THE_WICKED_AURA_NERF,
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
        coefficient: 12.4 * PURGE_THE_WICKED_AURA_NERF,
      }),
    damage,
    atonement,
    executeDoT,
    advanceTime,
  ],
};

export const ShadowWordPain: Spell = {
  category: SpellCategory.Damage,
  id: 579,
  icon: "spell_shadow_shadowwordpain",
  name: "Shadow Word: Pain",
  damage: 12.92,
  cost: createManaCost(1.8),
  effect: [
    (state) =>
      applyAura(state, {
        dot: true,
        name: "Shadow Word: Pain",
        duration: 16000,
        applied: state.time,
        expires: state.time + 16000,
        interval: 2000,
        ticks: 8,
        coefficient: 9.588,
      }),
    damage,
    atonement,
    executeDoT,
    advanceTime,
  ],
};

export const Shadowfiend: Spell = {
  category: SpellCategory.Cooldown,
  id: 34433,
  icon: "spell_shadow_shadowfiend",
  name: "Shadowfiend",
  damage: 44.4,
  effect: [
    (state) =>
      applyAura(state, {
        dot: true,
        name: "Shadowfiend",
        duration: 15_000,
        applied: state.time,
        expires: state.time + 15_000,
        interval: 1500,
        ticks: 9,
        coefficient: 44.4,
      }),
    damage,
    atonement,
    executeDoT,
    advanceTime,
  ],
};

export const Mindbender: Spell = {
  category: SpellCategory.Cooldown,
  id: 123040,
  icon: "spell_shadow_soulleech_3",
  name: "Mindbender",
  damage: 32.6,
  effect: [
    (state) =>
      applyAura(state, {
        dot: true,
        name: "Mindbender",
        duration: 12_000,
        applied: state.time,
        expires: state.time + 12_000,
        interval: 1500,
        ticks: 7,
        coefficient: 32.6,
      }),
    damage,
    atonement,
    executeDoT,
    advanceTime,
  ],
};

export const Skip: Spell = {
  category: SpellCategory.Tool,
  id: -1,
  icon: "ability_racial_timeismoney",
  name: "Skip",
  castTime: 1500,
  effect: [advanceTime],
};

export const Evangelism: Spell = {
  category: SpellCategory.Cooldown,
  id: 246287,
  icon: "spell_holy_divineillumination",
  name: "Evangelism",
  offGcd: false,
  effect: [evangelismExtension, advanceTime],
};

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
    const hasThePenitentOne = hasAura(state, "The Penitent One");
    const hasCastigation = hasAura(state, "Castigation");

    return 3 + (hasThePenitentOne ? 3 : 0) + (hasCastigation ? 1 : 0);
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
  effect: [cooldown, Manipulation, channel([damage, atonement])],
};

export const ShadowCovenant: Spell = {
  category: SpellCategory.Cooldown,
  id: 314867,
  icon: "spell_shadow_summonvoidwalker",
  name: "Shadow Covenant",
  cost: createManaCost(4.5),
  healing: 825,
  cooldown: 30000,
  effect: [
    cooldown,
    (state) => {
      return applyAura(state, {
        name: "Shadow Covenant",
        duration: 7000,
      });
    },
    advanceTime,
    healing,
  ],
};

export const Halo: Spell = {
  category: SpellCategory.Cooldown,
  id: 120517,
  icon: "ability_priest_halo",
  name: "Halo",
  cost: createManaCost(2.7),
  damage: 96.82,
  healing: 115 * (6 + 5.414), // 5.414 here represents the additional healing from healing beyond 6 targets
  castTime: 1500,
  effect: [advanceTime, healing, damage, atonement],
};

export const DivineStar: Spell = {
  category: SpellCategory.Cooldown,
  id: 110744,
  icon: "spell_priest_divinestar",
  name: "Divine Star",
  cost: createManaCost(2),
  damage: 56,
  healing: 140 * (6 + 5.414), // 5.414 here represents the additional healing from healing beyond 6 targets
  effect: [advanceTime, healing, damage, atonement],
};

export const MindBlast: Spell = {
  category: SpellCategory.Damage,
  id: 8092,
  icon: "spell_shadow_unholyfrenzy",
  name: "Mind Blast",
  cost: createManaCost(2.5),
  damage: () => 78.336 * 1.32,
  castTime: 1500,
  effect: [advanceTime, damage, atonement, InescapableTorment, Expiation],
};

export const PowerWordSolace: Spell = {
  category: SpellCategory.Cooldown,
  id: 129250,
  cost: createManaCost(-0.5),
  icon: "ability_priest_flashoflight",
  name: "Power Word: Solace",
  damage: 75.2,
  effect: [damage, atonement, advanceTime],
};

export const PowerInfusion: Spell = {
  category: SpellCategory.Buff,
  id: 10060,
  icon: "spell_holy_powerinfusion",
  name: "Power Infusion",
  offGcd: true,
  effect: [
    (state) =>
      applyAura(state, {
        name: "Power Infusion",
        duration: 25_000,
        statBuff: {
          amount: 0.25,
          stat: "haste",
          type: StatBuffType.MULTIPLICATIVE,
        },
      }),
  ],
};

export const Bloodlust: Spell = {
  category: SpellCategory.Buff,
  id: 2825,
  icon: "spell_nature_bloodlust",
  name: "Bloodlust",
  offGcd: true,
  effect: [
    (state) =>
      applyAura(state, {
        name: "Bloodlust",
        duration: 40_000,
        statBuff: {
          amount: 0.3,
          stat: "haste",
          type: StatBuffType.MULTIPLICATIVE,
        },
      }),
  ],
};

export const Innervate: Spell = {
  category: SpellCategory.Buff,
  id: 29166,
  icon: "spell_nature_lightning",
  name: "Innervate",
  offGcd: true,
  effect: [
    (state) =>
      applyAura(state, {
        name: "Innervate",
        duration: 10_000,
      }),
  ],
};

export { Rapture } from "./spells/Rapture";
export { PowerWordShield } from "./spells/PowerWordShield";
export { Renew } from "./spells/Renew";
export { LightsWrath } from "./spells/LightsWrath";
export { Smite } from "./spells/Smite";
export { Mindgames } from "./spells/Mindgames";
export { ShadowWordDeath } from "./spells/ShadowWordDeath";
export { ShadowWordDeathExecute } from "./spells/ShadowWordDeath";
export { FlashHeal } from "./spells/FlashHeal";
