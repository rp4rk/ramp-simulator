import { hasAura } from "../buff";
import { absorb, advanceTime, damage, healing } from "../mechanics";
import { SimState, Spell, SpellCategory } from "../types";
import { createManaCost, MANA_COST_TYPE } from "../mechanics/mana";
import { applyAtonement } from "../mechanics/atonement";

const RAPTURE_COEFFICIENT = 2;
const EXALTATION_COEFFICIENT = RAPTURE_COEFFICIENT * (1 + 0.115);
export const calculateShieldAbsorb = (state: SimState) => {
  const hasRaptureActive = hasAura(state, "Rapture");
  const hasExaltation = hasAura(state, "Exaltation");

  const raptureBonus = hasExaltation ? 1 + EXALTATION_COEFFICIENT : 1 + RAPTURE_COEFFICIENT;

  const shieldCoefficient = 165.6 * (hasRaptureActive ? raptureBonus : 1);

  return shieldCoefficient;
};

export const calculateCrystallineReflection = (state: SimState) => {
  const hasCrystallineReflection = hasAura(state, "Crystalline Reflection");

  return hasCrystallineReflection ? 42 : 0;
};

export const calculateCrystallineReflectionDamage = (state: SimState) => {
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
