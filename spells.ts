import { hasAura, numBuffsActive } from "./buff";
import {
  absorb,
  advanceTime,
  applyAura,
  atonement,
  ClarityOfMind,
  Cooldown,
  damage,
  healing,
} from "./mechanics";
import { getHastePerc } from "./player";
import { Spell } from "./types";

export const PurgeTheWicked: Spell = {
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
    advanceTime,
  ],
};

export const ShadowWordPain: Spell = {
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
    advanceTime,
  ],
};

export const Shadowfiend: Spell = {
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
          hasAura(state, "Rabid Shadows")
            ? 1500 / getHastePerc(state.player)
            : 1500,
        ticks: 10,
        damage: 46.2,
      }),
    damage,
    atonement,
    advanceTime,
  ],
};

export const Mindbender: Spell = {
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
          hasAura(state, "Rabid Shadows")
            ? 1500 / getHastePerc(state.player)
            : 1500,
        ticks: 10,
        damage: 33.88,
      }),
    damage,
    atonement,
    advanceTime,
  ],
};

export const SpiritShell: Spell = {
  name: "SpiritShell",
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

export const Penance: Spell = {
  name: "Penance",
  damage: (state) => {
    const hasThePenitentOne = hasAura(state, "The Penitent One");

    return hasThePenitentOne ? 112.8 * 1.84 : 112.8;
  },
  healing: 375,
  castTime: 2000,
  effect: [advanceTime, damage, atonement],
};

export const BoonOfTheAscended: Spell = {
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
  name: "Ascended Eruption",
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
  name: "Smite",
  damage: 49.7,
  castTime: 1500,
  effect: [advanceTime, damage, atonement],
};

export const Halo: Spell = {
  name: "Halo",
  damage: 96.82,
  healing: 864,
  castTime: 1500,
  effect: [advanceTime, healing, damage, atonement],
};

export const MindBlast: Spell = {
  name: "Mind Blast",
  damage: 74.42,
  absorb: 300,
  castTime: 1500,
  effect: [advanceTime, damage, atonement],
};

export const Mindgames: Spell = {
  name: "Mindgames",
  damage: (state) => {
    const mgAmp = hasAura(state, "Shattered Perceptions") ? 1.208 : 1;

    return 253.8 * mgAmp;
  },
  castTime: 2250,
  effect: [advanceTime, damage, atonement],
};

export const PowerWordSolace: Spell = {
  name: "Power Word: Solace",
  damage: 75.2,
  effect: [damage, atonement, advanceTime],
};

export const PowerWordRadiance: Spell = {
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

export const PowerWordShield: Spell = {
  name: "Power Word: Shield",
  absorb: 0,
  effect: [
    absorb,
    (state) =>
      applyAura(state, {
        name: "Atonement",
        applied: state.time,
        duration: 15000,
        expires: state.time + 15000,
      }),
    advanceTime,
  ],
};

export const Shadowmend: Spell = {
  name: "Shadowmend",
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
