import { createPlayer } from "./player";
import { iterator } from "./spellQueue";
import { SpellQueue } from "./types";

import {
  AscendedBlast,
  AscendedEruption,
  AscendedNova,
  BoonOfTheAscended,
  Penance,
  PowerWordSolace,
  PowerWordRadiance,
  PowerWordShield,
  Schism,
  Shadowmend,
  Smite,
  SpiritShell,
  Mindgames,
  PurgeTheWicked,
  Shadowfiend,
  Mindbender,
  MindBlast,
  ShadowWordPain,
  Halo,
} from "./spells";

function repeat<T>(item: T, num: number): T[] {
  return Array.from({ length: num }, () => item);
}

/**
 * Conduits + Legendaries
 */

const ClarityOfMind = {
  name: "Clarity of Mind",
  applied: 0,
  duration: Infinity,
  expires: Infinity,
};

const ThePenitentOne = {
  name: "The Penitent One",
  applied: 0,
  duration: Infinity,
  expires: Infinity,
};

const ShiningRadiance = {
  name: "Shining Radiance",
  applied: 0,
  duration: Infinity,
  expires: Infinity,
};

const RabidShadows = {
  name: "Rabid Shadows",
  applied: 0,
  duration: Infinity,
  expires: Infinity,
};

const Exaltation = {
  name: "Exaltation",
  applied: 0,
  duration: Infinity,
  expires: Infinity,
};

const CourageousAscension = {
  name: "Courageous Ascension",
  applied: 0,
  duration: Infinity,
  expires: Infinity,
};

const ShatteredPerceptions = {
  name: "Shattered Perceptions",
  applied: 0,
  duration: Infinity,
  expires: Infinity,
};

/**
 * Queues
 */
const CoomBoonQueue: SpellQueue = [
  PurgeTheWicked,
  PurgeTheWicked,
  Shadowmend,
  ...repeat(PowerWordShield, 9),
  PowerWordRadiance,
  BoonOfTheAscended,
  SpiritShell,
  AscendedBlast,
  PowerWordRadiance,
  AscendedBlast,
  Schism,
  // AscendedNova,
  // AscendedNova,
  AscendedBlast,
  AscendedNova,
  AscendedNova,
  AscendedBlast,
  AscendedNova,
  AscendedNova,
  AscendedBlast,
  AscendedNova,
  AscendedNova,
  AscendedBlast,
  AscendedNova,
  AscendedNova,
];

const BoonQueue: SpellQueue = [
  PurgeTheWicked,
  PurgeTheWicked,
  Shadowmend,
  ...repeat(PowerWordShield, 9),
  BoonOfTheAscended,
  SpiritShell,
  AscendedBlast,
  PowerWordRadiance,
  AscendedBlast,
  PowerWordRadiance,
  AscendedBlast,
  Schism,
  AscendedBlast,
  AscendedNova,
  AscendedNova,
  AscendedBlast,
  AscendedNova,
  AscendedNova,
  AscendedBlast,
  AscendedNova,
  AscendedNova,
];

const BoonBendingQueue: SpellQueue = [
  PurgeTheWicked,
  PurgeTheWicked,
  Shadowmend,
  ...repeat(PowerWordShield, 9),
  // ...repeat(PowerWordShield, 2),
  Mindbender,
  BoonOfTheAscended,
  SpiritShell,
  AscendedBlast,
  PowerWordRadiance,
  AscendedBlast,
  PowerWordRadiance,
  AscendedBlast,
  Schism,
  AscendedBlast,
  AscendedNova,
  AscendedNova,
  AscendedBlast,
  AscendedNova,
  AscendedNova,
  AscendedBlast,
  AscendedNova,
  AscendedNova,
];

const ShadowfiendQueue: SpellQueue = [
  PurgeTheWicked,
  PurgeTheWicked,
  Shadowmend,
  ...repeat(PowerWordShield, 9),
  PowerWordRadiance,
  Shadowfiend,
  PowerWordRadiance,
  SpiritShell,
  Schism,
  Penance,
  MindBlast,
  Smite,
  Smite,
  Smite,
  Smite,
  Smite,
  Smite,
];

/**
 * Iterator
 */
const test = iterator(
  {
    healing: 0,
    damage: 0,
    absorb: 0,
    buffs: new Map(),
    time: 0,
    player: createPlayer(2200, 33 * 40, 35 * 25, 35 * 10, 202),
    cooldowns: new Map(),
  },
  // BoonQueue,
  CoomBoonQueue,
  // ShadowfiendQueue,
  [
    ClarityOfMind,
    Exaltation,
    RabidShadows,
    // ThePenitentOne,
    CourageousAscension,
    // ShatteredPerceptions,
  ]
);

console.log({
  healing: test.healing,
  damage: test.damage,
  absorb: test.absorb,
  time: test.time,
});
