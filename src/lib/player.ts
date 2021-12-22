import { Player } from "./types";

const MASTERY_COEFFICIENT = 35;
const HASTE_COEFFICIENT = 33;
const CRIT_COEFFICIENT = 35;
const VERS_COEFFICIENT = 40;

type getStat = (p: Player) => number;

export const getMasteryPerc: getStat = (p) => 1.108 + ((p.mastery / MASTERY_COEFFICIENT) * 1.35) / 100;
export const getHastePerc: getStat = (p) => 1 + p.haste / HASTE_COEFFICIENT / 100;
export const getCritPerc: getStat = (p) => 1.05 + p.crit / CRIT_COEFFICIENT / 100;
export const getVersPerc: getStat = (p) => 1 + p.vers / VERS_COEFFICIENT / 100;

export function createPlayer(spellpower: number, haste: number, mastery: number, crit: number, vers: number): Player {
  return {
    spellpower,
    haste,
    mastery,
    crit,
    vers,
  };
}
