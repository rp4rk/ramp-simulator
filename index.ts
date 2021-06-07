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
} from "./spells";

function repeat<T>(item: T, num: number): T[] {
  return Array.from({ length: num }, () => item);
}

const priestSpellQueue: SpellQueue = [
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
  AscendedNova,
  AscendedBlast,
  AscendedNova,
  AscendedNova,
  AscendedBlast,
  AscendedNova,
];

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

const test = iterator(
  {
    healing: 0,
    damage: 0,
    absorb: 0,
    buffs: new Map(),
    time: 0,
    player: createPlayer(1, 886, 0, 0, 0),
    cooldowns: new Map(),
  },
  priestSpellQueue,
  [
    ClarityOfMind,
    // ThePenitentOne,
    CourageousAscension,
    // ShatteredPerceptions,
  ]
);

console.log(test.absorb);
