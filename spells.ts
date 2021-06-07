import { buffActive, numBuffsActive } from "./buff";
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
    const hasThePenitentOne = buffActive(state, "The Penitent One");

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
    const hasCourageousAscension = buffActive(state, "Courageous Ascension");
    const caMultiplier = 1 + (hasCourageousAscension ? 0.4 : 0);

    return 168.26 * caMultiplier;
  },
  healing: 201.91,
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
  damage: 69.56,
  healing: 135.36,
  shortGcd: true,
  effect: [
    healing,
    damage,
    (state) =>
      applyAura(state, {
        name: "Eruption Stacks",
        duration: 11000,
        applied: state.time,
        expires: state.time + 11000,
      }),
    atonement,
    advanceTime,
  ],
};

export const AscendedEruption: Spell = {
  name: "Ascended Eruption",
  damage: (state) => {
    const hasCourageousAscension = buffActive(state, "Courageous Ascension");
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
    const mgAmp = buffActive(state, "Shattered Perceptions") ? 1.208 : 1;

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
  absorb: 165.6,
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
