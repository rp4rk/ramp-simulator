import { hasAura, numBuffsActive } from "./buff";
import {
  absorb,
  advanceTime,
  applyAura,
  atonement,
  ClarityOfMind,
  Cooldown,
  damage,
  executeDoT,
  healing,
  EvangelismExtension,
  channel,
} from "./mechanics";
import { getHastePerc } from "./player";
import { Channel, SimState, Spell, SpellCategory } from "./types";

export const PurgeTheWicked: Spell = {
  category: SpellCategory.Damage,
  id: 204197,
  icon: "ability_mage_firestarter",
  name: "Purge the Wicked",
  damage: 22.3,
  effect: [
    (state) =>
      applyAura(state, {
        name: "Purge the Wicked",
        duration: 20000,
        applied: state.time,
        expires: state.time + 20000,
        interval: 2000,
        ticks: 10,
        damage: 11.656,
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
  effect: [
    (state) =>
      applyAura(state, {
        name: "Shadow Word: Pain",
        duration: 16000,
        applied: state.time,
        expires: state.time + 16000,
        interval: 2000,
        ticks: 8,
        damage: 9.588,
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
        name: "Shadowfiend",
        duration: 15000,
        applied: state.time,
        expires: state.time + 15000,
        interval: (state) =>
          hasAura(state, "Rabid Shadows") ? 1150 / getHastePerc(state.player) : 1500 / getHastePerc(state.player),
        ticks: 10,
        damage: 46.2,
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
        name: "Mindbender",
        duration: 1200,
        applied: state.time,
        expires: state.time + 12000,
        interval: (state) =>
          hasAura(state, "Rabid Shadows") ? 1150 / getHastePerc(state.player) : 1500 / getHastePerc(state.player),
        ticks: 10,
        damage: 33.88,
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
  effect: [
    (state, spell) =>
      applyAura(state, {
        name: "Spirit Shell",
        duration: 11000,
        applied: state.time,
        expires: state.time + 11000,
      }),
    ClarityOfMind,
  ],
};

export const Evangelism: Spell = {
  category: SpellCategory.Cooldown,
  id: 246287,
  icon: "spell_holy_divineillumination",
  name: "Evangelism",
  offGcd: false,
  effect: [EvangelismExtension, advanceTime],
};

export const Penance: Channel = {
  category: SpellCategory.Damage,
  channel: true,
  id: 47540,
  icon: "spell_holy_penance",
  name: "Penance",
  cooldown: 9000,
  ticks: (state) => {
    const hasThePenitentOne = hasAura(state, "The Penitent One");
    return 3 + (hasThePenitentOne ? 3 : 0);
  },
  damage: (state) => {
    const hasTilDawn = hasAura(state, "Til' Dawn");

    const multiplier = hasTilDawn ? 1.95 : 1;
    return 37.6 * multiplier;
  },
  healing: 375,
  castTime: 2000,
  effect: [Cooldown, channel([damage, atonement])],
};

export const BoonOfTheAscended: Spell = {
  category: SpellCategory.Kyrian,
  id: 325013,
  icon: "ability_bastion_priest",
  name: "Boon of the Ascended",
  castTime: 1500,
  effect: [
    advanceTime,
    (state) =>
      applyAura(state, {
        name: "Boon of the Ascended",
        duration: 10000,
        applied: state.time,
        expires: state.time + 10000,
        consumed: false,
      }),
    (state) =>
      applyAura(state, {
        name: "Eruption Stacks",
        duration: 11000,
        applied: state.time,
        expires: state.time + 11000,
      }),
  ],
};

export const AscendedBlast: Spell = {
  category: SpellCategory.Kyrian,
  id: 325315,
  icon: "spell_animabastion_missile",
  name: "Ascended Blast",
  damage: (state) => {
    const hasCourageousAscension = hasAura(state, "Courageous Ascension");
    const caMultiplier = 1 + (hasCourageousAscension ? 0.4 : 0);
    const hasBoon = hasAura(state, "Boon of the Ascended");

    return hasBoon ? 168.26 * caMultiplier : 0;
  },
  healing: (state) => (hasAura(state, "Boon of the Ascended") ? 201.91 : 0),
  cooldown: (state) => {
    const { player } = state;
    const haste = getHastePerc(player);

    return 3000 / haste;
  },
  shortGcd: true,
  effect: [
    Cooldown,
    healing,
    damage,
    atonement,
    (state) =>
      applyAura(
        state,
        {
          name: "Eruption Stacks",
          duration: 11000,
          applied: state.time,
          expires: state.time + 11000,
        },
        5
      ),
    advanceTime,
  ],
};

export const AscendedNova: Spell = {
  category: SpellCategory.Kyrian,
  id: 325020,
  icon: "spell_animabastion_nova",
  name: "Ascended Nova",
  damage: (state) => (hasAura(state, "Boon of the Ascended") ? 69.56 : 0),
  healing: (state) => (hasAura(state, "Boon of the Ascended") ? 135.36 : 0),
  shortGcd: true,
  effect: [
    healing,
    damage,
    (state) =>
      (hasAura(state, "Boon of the Ascended") &&
        applyAura(state, {
          name: "Eruption Stacks",
          duration: 11000,
          applied: state.time,
          expires: state.time + 11000,
        })) ||
      state,
    atonement,
    advanceTime,
  ],
};

export const AscendedEruption: Spell = {
  category: SpellCategory.Ignored,
  id: 3565449,
  icon: "ability_bastion_priest",
  name: "Ascended Eruption",
  offGcd: true,
  damage: (state) => {
    const hasCourageousAscension = hasAura(state, "Courageous Ascension");
    const activeBoonStacks = numBuffsActive(state, "Eruption Stacks");
    const caMultiplier = hasCourageousAscension ? 0.04 : 0.03;
    const boonMultiplier = 1 + activeBoonStacks * caMultiplier;

    return 197.4 * boonMultiplier;
  },
  healing: 896.76,
  effect: [damage, healing, atonement],
};

export const Schism: Spell = {
  category: SpellCategory.Cooldown,
  id: 214621,
  icon: "spell_warlock_focusshadow",
  name: "Schism",
  damage: 141,
  castTime: 1500,
  cooldown: 24000,
  effect: [
    Cooldown,
    advanceTime,
    damage,
    atonement,
    (state) => {
      return applyAura(state, {
        name: "Schism",
        applied: state.time,
        duration: 9000,
        expires: state.time + 9000,
      });
    },
  ],
};

export const Smite: Spell = {
  category: SpellCategory.Damage,
  id: 585,
  icon: "spell_holy_holysmite",
  name: "Smite",
  damage: 49.7,
  castTime: 1500,
  effect: [advanceTime, damage, atonement],
};

export const Halo: Spell = {
  category: SpellCategory.Cooldown,
  id: 120517,
  icon: "ability_priest_halo",
  name: "Halo",
  damage: 96.82,
  healing: 864,
  castTime: 1500,
  effect: [advanceTime, healing, damage, atonement],
};

export const MindBlast: Spell = {
  category: SpellCategory.Damage,
  id: 8092,
  icon: "spell_shadow_unholyfrenzy",
  name: "Mind Blast",
  damage: 74.42,
  absorb: 300,
  castTime: 1500,
  effect: [advanceTime, damage, atonement],
};

export const Mindgames: Spell = {
  category: SpellCategory.Venthyr,
  id: 323673,
  icon: "ability_revendreth_priest",
  name: "Mindgames",
  damage: (state) => {
    const mgAmp = hasAura(state, "Shattered Perceptions") ? 1.208 : 1;

    return 253.8 * mgAmp;
  },
  castTime: 1500,
  effect: [advanceTime, damage, atonement],
};

export const PowerWordSolace: Spell = {
  category: SpellCategory.Cooldown,
  id: 129250,
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
  healing: 525,
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

export const PowerWordShield: Spell = {
  category: SpellCategory.Applicator,
  id: 17,
  icon: "spell_holy_powerwordshield",
  name: "Power Word: Shield",
  absorb: calculateShieldAbsorb,
  effect: [absorb, applyAtonement, advanceTime],
};

export const Rapture: Spell = {
  category: SpellCategory.Cooldown,
  id: 47536,
  icon: "spell_holy_rapture",
  name: "Rapture",
  absorb: calculateShieldAbsorb,
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
  id: 136202,
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
