import { hasAura, numBuffsActive } from "./buff";
import {
  absorb,
  advanceTime,
  applyAura,
  atonement,
  clarityOfMind,
  cooldown,
  damage,
  executeDoT,
  healing,
  evangelismExtension,
  channel,
} from "./mechanics";
import { getHastePerc } from "./player";
import { Channel, SimState, Spell, SpellCategory, StatBuffType } from "./types";
import { createManaCost, MANA_COST_TYPE } from "./mechanics/mana";

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
  damage: 46.2,
  effect: [
    (state) =>
      applyAura(state, {
        dot: true,
        name: "Shadowfiend",
        duration: 15_000,
        applied: state.time,
        expires: state.time + 15_000,
        interval: (state) =>
          hasAura(state, "Rabid Shadows")
            ? 1150 / getHastePerc(state.player)
            : 1500 / getHastePerc(state.player),
        ticks: 10,
        coefficient: 46.2,
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
  damage: 33.88,
  effect: [
    (state) =>
      applyAura(state, {
        dot: true,
        name: "Mindbender",
        duration: 12_000,
        applied: state.time,
        expires: state.time + 12_000,
        interval: (state) =>
          hasAura(state, "Rabid Shadows")
            ? 1150 / getHastePerc(state.player)
            : 1500 / getHastePerc(state.player),
        ticks: 10,
        coefficient: 33.88,
      }),
    damage,
    atonement,
    executeDoT,
    advanceTime,
  ],
};

export const SpiritShell: Spell = {
  category: SpellCategory.Cooldown,
  id: 109964,
  icon: "ability_shaman_astralshift",
  name: "Spirit Shell",
  offGcd: true,
  cost: createManaCost(2),
  effect: [
    (state) => {
      const duration = 10_000;

      return applyAura(state, {
        name: "Spirit Shell",
        duration,
        applied: state.time,
        expires: state.time + duration,
      });
    },
    clarityOfMind,
  ],
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

export const Schism: Spell = {
  category: SpellCategory.Cooldown,
  id: 214621,
  icon: "spell_warlock_focusshadow",
  name: "Schism",
  cost: createManaCost(0.5),
  damage: 141,
  castTime: 1500,
  cooldown: 24000,
  effect: [
    cooldown,
    advanceTime,
    damage,
    atonement,
    (state) => {
      return applyAura(state, {
        name: "Schism",
        duration: (state) => {
          const SCHISM_DURATION = 9000;
          const MS_BONUS = 1.5;
          const hasMaliciousScission = hasAura(state, "Malicious Scission");

          return hasMaliciousScission ? SCHISM_DURATION * MS_BONUS : SCHISM_DURATION;
        },
      });
    },
  ],
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

export const Smite: Spell = {
  category: SpellCategory.Damage,
  id: 585,
  icon: "spell_holy_holysmite",
  cost: createManaCost(0.4),
  name: "Smite",
  damage: (state) => {
    const COEFFICIENT = 49.7;
    const hasLessonsInHumility = hasAura(state, "Lessons in Humility");
    if (!hasLessonsInHumility) return COEFFICIENT;

    const smiteAmp = numBuffsActive(state, "Atonement") >= 3 ? 1.2 : 1;
    return smiteAmp * COEFFICIENT;
  },
  castTime: 1500,
  effect: [advanceTime, damage, atonement],
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
  cost: createManaCost(3),
  cooldown: (state) => {
    const hastePerc = getHastePerc(state.player);
    const hasImprovedMindBlast = hasAura(state, "Improved Mind Blast");
    const baseCast = 15_000 - (hasImprovedMindBlast ? 6000 : 0);

    return baseCast / hastePerc;
  },
  damage: 74.42,
  absorb: 300,
  castTime: 1500,
  effect: [cooldown, advanceTime, damage, absorb, atonement],
};

export const Mindgames: Spell = {
  category: SpellCategory.Venthyr,
  id: 323673,
  icon: "ability_revendreth_priest",
  name: "Mindgames",
  absorb: 450,
  healing: 450,
  damage: 253.8,
  castTime: 1500,
  effect: [advanceTime, damage, absorb, healing, atonement],
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

export const PowerWordRadiance: Spell = {
  category: SpellCategory.Applicator,
  id: 194509,
  icon: "spell_priest_powerword",
  name: "Power Word: Radiance",
  metadata: ["Applicator"],
  cost: createManaCost(6.5),
  healing: (state) => {
    const hasShiningRadiance = hasAura(state, "Shining Radiance");

    return 525 * (hasShiningRadiance ? 1.72 : 1);
  },
  castTime: 2000,
  effect: [
    advanceTime,
    healing,
    (state) => {
      return applyAura(
        state,
        {
          name: "Atonement",
          applied: state.time,
          duration: 9000,
          expires: state.time + 9000,
        },
        5
      );
    },
  ],
};

const ATONEMENT_BASE_DURATION = 15000;
const applyAtonement = (state: SimState) =>
  applyAura(state, {
    name: "Atonement",
    applied: state.time,
    duration: (state) => {
      const hasClarityOfMind = hasAura(state, "Clarity of Mind");
      const hasRaptureActive = hasAura(state, "Rapture");
      const bonusDuration = hasClarityOfMind && hasRaptureActive ? 6000 : 0;

      return ATONEMENT_BASE_DURATION + bonusDuration;
    },
  });

const RAPTURE_COEFFICIENT = 2;
const EXALTATION_COEFFICIENT = RAPTURE_COEFFICIENT * (1 + 0.115);
const calculateShieldAbsorb = (state: SimState) => {
  const hasRaptureActive = hasAura(state, "Rapture");
  const hasExaltation = hasAura(state, "Exaltation");

  const raptureBonus = hasExaltation ? 1 + EXALTATION_COEFFICIENT : 1 + RAPTURE_COEFFICIENT;

  const shieldCoefficient = 165.6 * (hasRaptureActive ? raptureBonus : 1);

  return shieldCoefficient;
};

const calculateCrystallineReflection = (state: SimState) => {
  const hasCrystallineReflection = hasAura(state, "Crystalline Reflection");

  return hasCrystallineReflection ? 42 : 0;
};

const calculateCrystallineReflectionDamage = (state: SimState) => {
  const hasCrystallineReflection = hasAura(state, "Crystalline Reflection");
  const shieldAbsorbValue = calculateShieldAbsorb(state);

  return shieldAbsorbValue * (hasCrystallineReflection ? 0.2 : 0);
};

export const PowerWordShield: Spell = {
  category: SpellCategory.Applicator,
  id: 17,
  icon: "spell_holy_powerwordshield",
  metadata: ["Applicator"],
  cost: (state) => {
    const hasShieldDiscipline = hasAura(state, "Shield Discipline");
    const hasAmalgams = hasAura(state, "Amalgam's Seventh Spine");
    const sdDiscount = hasShieldDiscipline ? 0.5 : 0;
    const amDiscount = hasAmalgams ? 263 : 0; // https://ptr.wowhead.com/spell=215266/fragile-echoes @ 272
    const initialCost = createManaCost(3.1 - sdDiscount)(state) - amDiscount;

    return createManaCost(initialCost, MANA_COST_TYPE.ABSOLUTE)(state);
  },
  name: "Power Word: Shield",
  absorb: calculateShieldAbsorb,
  healing: calculateCrystallineReflection,
  damage: calculateCrystallineReflectionDamage,
  effect: [absorb, healing, damage, applyAtonement, advanceTime],
};

export const Rapture: Spell = {
  category: SpellCategory.Cooldown,
  id: 47536,
  icon: "spell_holy_rapture",
  name: "Rapture",
  cost: createManaCost(3.1),
  absorb: calculateShieldAbsorb,
  healing: calculateCrystallineReflection,
  damage: calculateCrystallineReflectionDamage,
  effect: [
    (state) =>
      applyAura(state, {
        name: "Rapture",
        applied: state.time,
        duration: (state) => {
          const hasExaltation = hasAura(state, "Exaltation");

          return 8000 + (hasExaltation ? 1000 : 0);
        },
      }),
    healing,
    damage,
    absorb,
    applyAtonement,
    advanceTime,
  ],
};

export const Shadowmend: Spell = {
  category: SpellCategory.Applicator,
  id: 136202,
  icon: "spell_shadow_shadowmend",
  name: "Shadow Mend",
  metadata: ["Applicator"],
  cost: (state) => {
    const hasAmalgams = hasAura(state, "Amalgam's Seventh Spine");
    const amDiscount = hasAmalgams ? 263 : 0; // https://ptr.wowhead.com/spell=215266/fragile-echoes @ 272
    const initialCost = createManaCost(3.5)(state) - amDiscount;

    return createManaCost(initialCost, MANA_COST_TYPE.ABSOLUTE)(state);
  },
  healing: 320,
  castTime: 1500,
  effect: [
    advanceTime,
    healing,
    (state) =>
      applyAura(state, {
        name: "Atonement",
        applied: state.time,
        duration: 15000,
        expires: state.time + 15000,
      }),
  ],
};

export const ScrawledWordOfRecall: Spell = {
  category: SpellCategory.Cooldown,
  id: 186425,
  icon: "inv_inscription_80_scroll",
  name: "Scrawled Word of Recall",
  fixedGcd: true,
  castTime: 500,
  effect: [
    advanceTime,
    (state) => {
      const penanceCooldownTimestamp = state.cooldowns.get("Penance");

      if (penanceCooldownTimestamp) {
        state.cooldowns.set("Penance", penanceCooldownTimestamp - 7200);
      }

      return state;
    },
  ],
};

export const PowerInfusion: Spell = {
  category: SpellCategory.Cooldown,
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
  category: SpellCategory.Cooldown,
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
  category: SpellCategory.Cooldown,
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

export const LightsWrath: Spell = {
  category: SpellCategory.Cooldown,
  id: 373178,
  icon: "inv_staff_2h_artifacttome_d_01",
  name: "Light's Wrath",
  damage: (state) => {
    const atonementCount = numBuffsActive(state, "Atonement");
    const lwMultiplier = 0.1;

    return 175 * (1 + lwMultiplier * atonementCount);
  },
  castTime: 2500,
  effect: [advanceTime, damage, atonement],
};
