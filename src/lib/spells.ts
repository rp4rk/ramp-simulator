import {
  advanceTime,
  applyAura,
  atonement,
  cooldown,
  damage,
  executeDoT,
  healing,
  evangelismExtension,
} from "./mechanics";
import { Spell, SpellCategory, StatBuffType } from "./types";
import { createManaCost } from "./mechanics/mana";
import { buildDamage } from "./mechanics/util/buildDamage";
import {
  applyTwilightEquilibriumShadow,
  twilightEquilibriumBuff,
  TwilightEquilibriumSchool,
} from "./talents/TwilightEquilibrium";

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
  damage: buildDamage(96.82, [twilightEquilibriumBuff(TwilightEquilibriumSchool.Holy)]),
  healing: 115 * (6 + 5.414), // 5.414 here represents the additional healing from healing beyond 6 targets
  castTime: 1500,
  effect: [advanceTime, healing, damage, atonement, applyTwilightEquilibriumShadow],
};

export const DivineStar: Spell = {
  category: SpellCategory.Cooldown,
  id: 110744,
  icon: "spell_priest_divinestar",
  name: "Divine Star",
  cost: createManaCost(2),
  damage: buildDamage(56, [twilightEquilibriumBuff(TwilightEquilibriumSchool.Holy)]),
  healing: 140 * (6 + 5.414), // 5.414 here represents the additional healing from healing beyond 6 targets
  effect: [advanceTime, healing, damage, atonement, applyTwilightEquilibriumShadow],
};

export const PowerWordSolace: Spell = {
  category: SpellCategory.Cooldown,
  id: 129250,
  cost: createManaCost(-0.5),
  icon: "ability_priest_flashoflight",
  name: "Power Word: Solace",
  damage: buildDamage(75.2, [twilightEquilibriumBuff(TwilightEquilibriumSchool.Holy)]),
  effect: [damage, atonement, advanceTime, applyTwilightEquilibriumShadow],
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
export { MindBlast } from "./spells/MindBlast";
export { PowerWordRadiance } from "./spells/PowerWordRadiance";
export { Schism } from "./spells/Schism";
export { PurgeTheWicked } from "./spells/PurgeTheWicked";
export { ShadowWordPain } from "./spells/ShadowWordPain";
export { Penance } from "./spells/Penance";
export { PowerOfTheDarkSide } from "./talents/PowerOfTheDarkSide";
export { HarshDiscipline } from "./talents/HarshDiscipline";
