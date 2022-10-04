import { Player, StatBuffType } from "./types";

type getStat = (p: Player) => number;

const MASTERY_COEFFICIENT = 180;
const HASTE_COEFFICIENT = 170;
const CRIT_COEFFICIENT = 180;
const VERS_COEFFICIENT = 205;

const DIMINISHING_RETURNS = [
  [30, 0],
  [9, 0.1],
  [8, 0.2],
  [7, 0.3],
  [12, 0.4],
  [60, 0.5],
  [Infinity, 1],
];

const applyMultiplicativeBonus = (n1: number, n2: number) => n1 * (1 + n2);
const applyAdditiveBonus = (n1: number, n2: number) => n1 + n2;

// export const getHastePerc: getStat = (p) => 1 + p.haste / HASTE_COEFFICIENT / 100;
export const getHastePerc: getStat = (p) => {
  const buffHasteRating = p.statBuffs.haste
    .filter((buff) => buff.type === StatBuffType.RATING)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const hasteMultiplicativeBuffs = p.statBuffs.haste.filter(
    (buff) => buff.type === StatBuffType.MULTIPLICATIVE
  );
  const hasteAdditiveBuffs = p.statBuffs.haste.filter(
    (buff) => buff.type === StatBuffType.ADDITIVE
  );

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
    [p.haste + buffHasteRating, 0]
  );

  const hasteWithAdditiveBuffs = hasteAdditiveBuffs.reduce(
    (acc, curr) => applyAdditiveBonus(acc, curr.amount),
    1 + hasteValue / 100
  );

  return hasteMultiplicativeBuffs.reduce(
    (acc, curr) => applyMultiplicativeBonus(acc, curr.amount),
    hasteWithAdditiveBuffs
  );
};

// export const getMasteryPerc: getStat = (p) => 1.108 + ((p.mastery / MASTERY_COEFFICIENT) * 1.35) / 100;
export const getMasteryPerc: getStat = (p) => {
  const buffMasteryRating = p.statBuffs.mastery
    .filter((buff) => buff.type === StatBuffType.RATING)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const masteryMultiplicativeBuffs = p.statBuffs.mastery.filter(
    (buff) => buff.type === StatBuffType.MULTIPLICATIVE
  );
  const masteryAdditiveBuffs = p.statBuffs.mastery.filter(
    (buff) => buff.type === StatBuffType.ADDITIVE
  );

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
    [p.mastery + buffMasteryRating, 0]
  );

  const masteryWithAdditiveBuffs = masteryAdditiveBuffs.reduce(
    (acc, curr) => applyAdditiveBonus(acc, curr.amount),
    1.108 + (masteryValue * 1.35) / 100
  );

  return masteryMultiplicativeBuffs.reduce(
    (acc, curr) => applyMultiplicativeBonus(acc, curr.amount),
    masteryWithAdditiveBuffs
  );
};

// export const getCritPerc: getStat = (p) => 1.05 + p.crit / CRIT_COEFFICIENT / 100;
export const getCritPerc: getStat = (p) => {
  const buffCritRating = p.statBuffs.crit
    .filter((buff) => buff.type === StatBuffType.RATING)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const critMultiplicativeBuffs = p.statBuffs.crit.filter(
    (buff) => buff.type === StatBuffType.MULTIPLICATIVE
  );
  const critAdditiveBuffs = p.statBuffs.crit.filter((buff) => buff.type === StatBuffType.ADDITIVE);

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
    [p.crit + buffCritRating, 0]
  );

  const critWithAdditiveBuffs = critAdditiveBuffs.reduce(
    (acc, curr) => applyAdditiveBonus(acc, curr.amount),
    1.05 + critValue / 100
  );

  return critMultiplicativeBuffs.reduce(
    (acc, curr) => applyMultiplicativeBonus(acc, curr.amount),
    critWithAdditiveBuffs
  );
};

// export const getVersPerc: getStat = (p) => 1 + p.vers / VERS_COEFFICIENT / 100;
export const getVersPerc: getStat = (p) => {
  const buffVersRating = p.statBuffs.vers
    .filter((buff) => buff.type === StatBuffType.RATING)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const versMultiplicativeBuffs = p.statBuffs.vers.filter(
    (buff) => buff.type === StatBuffType.MULTIPLICATIVE
  );
  const versAdditiveBuffs = p.statBuffs.vers.filter((buff) => buff.type === StatBuffType.ADDITIVE);

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
    [p.vers + buffVersRating, 0]
  );

  const versWithAdditiveBuffs = versAdditiveBuffs.reduce(
    (acc, curr) => applyAdditiveBonus(acc, curr.amount),
    1 + versValue / 100
  );

  return versMultiplicativeBuffs.reduce(
    (acc, curr) => applyMultiplicativeBonus(acc, curr.amount),
    versWithAdditiveBuffs
  );
};

export function createPlayer(
  spellpower: number,
  haste: number,
  mastery: number,
  crit: number,
  vers: number
): Player {
  return {
    spellpower,
    haste,
    mastery,
    crit,
    vers,
    statBuffs: {
      spellpower: [],
      haste: [],
      mastery: [],
      crit: [],
      vers: [],
    },
  };
}
