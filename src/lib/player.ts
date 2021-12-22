import { Player } from "./types";

type getStat = (p: Player) => number;

const MASTERY_COEFFICIENT = 35;
const HASTE_COEFFICIENT = 33;
const CRIT_COEFFICIENT = 35;
const VERS_COEFFICIENT = 40;

const DIMINISHING_RETURNS = [
  [30, 0],
  [9, 0.1],
  [8, 0.2],
  [7, 0.3],
  [12, 0.4],
  [60, 0.5],
  [Infinity, 1],
];

// export const getHastePerc: getStat = (p) => 1 + p.haste / HASTE_COEFFICIENT / 100;
export const getHastePerc: getStat = (p) => {
  const [, hasteValue] = DIMINISHING_RETURNS.reduce(
    ([remainingRating, value], [threshold, penalty]) => {
      if (remainingRating <= 0) {
        return [remainingRating, value];
      }
      // Calculate an effective threshold for this bracket
      const effectiveCoefficient = HASTE_COEFFICIENT / (1 - penalty);

      // The haste we're looking at adding
      const potentialHastePerc = remainingRating / effectiveCoefficient;

      // Determine the correct haste % to add
      const additionalHaste = Math.min(threshold, potentialHastePerc);
      const additionalHasteRatingCost = additionalHaste * effectiveCoefficient;

      return [remainingRating - additionalHasteRatingCost, value + additionalHaste];
    },
    [p.haste, 0]
  );

  return 1 + hasteValue / 100;
};

// export const getMasteryPerc: getStat = (p) => 1.108 + ((p.mastery / MASTERY_COEFFICIENT) * 1.35) / 100;
export const getMasteryPerc: getStat = (p) => {
  const [, masteryValue] = DIMINISHING_RETURNS.reduce(
    ([remainingRating, value], [threshold, penalty]) => {
      if (remainingRating <= 0) {
        return [remainingRating, value];
      }
      // Calculate an effective threshold for this bracket
      const effectiveCoefficient = MASTERY_COEFFICIENT / (1 - penalty);

      // The Mastery we're looking at adding
      const potentialMasteryPerc = remainingRating / effectiveCoefficient;

      // Determine the correct Mastery % to add
      const additionalMastery = Math.min(threshold, potentialMasteryPerc);
      const additionalMasteryRatingCost = additionalMastery * effectiveCoefficient;

      return [remainingRating - additionalMasteryRatingCost, value + additionalMastery];
    },
    [p.mastery, 0]
  );

  return 1.108 + (masteryValue * 1.35) / 100;
};

// export const getCritPerc: getStat = (p) => 1.05 + p.crit / CRIT_COEFFICIENT / 100;
export const getCritPerc: getStat = (p) => {
  const [, critValue] = DIMINISHING_RETURNS.reduce(
    ([remainingRating, value], [threshold, penalty]) => {
      if (remainingRating <= 0) {
        return [remainingRating, value];
      }
      // Calculate an effective threshold for this bracket
      const effectiveCoefficient = CRIT_COEFFICIENT / (1 - penalty);

      // The Crit we're looking at adding
      const potentialCritPerc = remainingRating / effectiveCoefficient;

      // Determine the correct Crit % to add
      const additionalCrit = Math.min(threshold, potentialCritPerc);
      const additionalCritRatingCost = additionalCrit * effectiveCoefficient;

      return [remainingRating - additionalCritRatingCost, value + additionalCrit];
    },
    [p.crit, 0]
  );

  return 1.05 + critValue / 100;
};

// export const getVersPerc: getStat = (p) => 1 + p.vers / VERS_COEFFICIENT / 100;
export const getVersPerc: getStat = (p) => {
  const [, versValue] = DIMINISHING_RETURNS.reduce(
    ([remainingRating, value], [threshold, penalty]) => {
      if (remainingRating <= 0) {
        return [remainingRating, value];
      }
      // Calculate an effective threshold for this bracket
      const effectiveCoefficient = VERS_COEFFICIENT / (1 - penalty);

      // The Vers we're looking at adding
      const potentialVersPerc = remainingRating / effectiveCoefficient;

      // Determine the correct Vers % to add
      const additionalVers = Math.min(threshold, potentialVersPerc);
      const additionalVersRatingCost = additionalVers * effectiveCoefficient;

      return [remainingRating - additionalVersRatingCost, value + additionalVers];
    },
    [p.vers, 0]
  );

  return 1 + versValue / 100;
};

export function createPlayer(spellpower: number, haste: number, mastery: number, crit: number, vers: number): Player {
  return {
    spellpower,
    haste,
    mastery,
    crit,
    vers,
  };
}
