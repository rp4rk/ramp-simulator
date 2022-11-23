import { consumeAura, hasAura } from "lib/buff";
import { applyAura } from "lib/mechanics";
import { getAuraStacks } from "lib/mechanics/aura";
import { hasTalent, getTalentPoints } from "lib/talents";
import { Spell, SpellCategory, StateSpellReducer } from "lib/types";
import { applyAuraStack } from "../mechanics/aura";

export const HARSH_DISCIPLINE_ID = 373180;
const HARSH_DISCIPLINE_STACK_NAME = "Harsh Discipline (Stacks)";
const HARSH_DISCIPLINE_STACK_MAP = new Map([
  [1, 8],
  [2, 4],
]);

/**
 * Applies the stacking buff gained from Smite
 */
export const applyHarshDisciplineStack: StateSpellReducer = (state) => {
  const hasHarshDiscipline = hasTalent(state, HARSH_DISCIPLINE_ID);
  if (!hasHarshDiscipline) return state;
  const harshDisciplinePoints = getTalentPoints(state, HARSH_DISCIPLINE_ID);
  const harshDisciplineStacks = HARSH_DISCIPLINE_STACK_MAP.get(harshDisciplinePoints);
  if (!harshDisciplineStacks) {
    console.error("Could not get Harsh Discipline stacks for points", harshDisciplinePoints);
    return state;
  }

  // Apply a stack
  if (hasAura(state, HARSH_DISCIPLINE_STACK_NAME)) {
    return applyAuraStack(state, HARSH_DISCIPLINE_STACK_NAME, 1);
  }

  // Ignore if we are over stack count, this shouldn't be possible but just in case
  if (getAuraStacks(state, HARSH_DISCIPLINE_STACK_NAME) >= harshDisciplineStacks) {
    console.error("Somehow got more than the max stacks of Harsh Discipline");
    return state;
  }

  return applyAura(state, {
    name: HARSH_DISCIPLINE_STACK_NAME,
    duration: Infinity,
  });
};

/**
 * Consumes the stacks and applies Harsh Discipline
 */
export const applyHarshDiscipline: StateSpellReducer = (state) => {
  if (!hasTalent(state, HARSH_DISCIPLINE_ID)) return state;
  const harshDisciplinePoints = getTalentPoints(state, HARSH_DISCIPLINE_ID);
  const harshDisciplineStacks = HARSH_DISCIPLINE_STACK_MAP.get(harshDisciplinePoints);

  const stacks = getAuraStacks(state, HARSH_DISCIPLINE_STACK_NAME);

  if (stacks === harshDisciplineStacks) {
    const newAura = applyAura(state, {
      name: "Harsh Discipline",
      duration: 15_000,
    });

    return consumeAura(HARSH_DISCIPLINE_STACK_NAME)(newAura);
  }

  return state;
};

/**
 * Utility spell to instantly proc HD
 */
export const HarshDiscipline: Spell = {
  category: SpellCategory.Buff,
  id: 10060,
  icon: "ability_paladin_handoflight",
  name: "Harsh Discipline",
  offGcd: true,
  effect: [
    (state) =>
      applyAura(state, {
        name: "Harsh Discipline",
        duration: 15_000,
      }),
  ],
};
