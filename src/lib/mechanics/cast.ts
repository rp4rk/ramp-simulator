/**
 * Casts the provided spell
 * This spell has to be instant and not on GCD
 */

import { StateSpellReducer } from "lib/types";

export const cast: StateSpellReducer = (state, spell) => {
  if (!("effect" in spell)) return state;
  if (!spell.effect) return state;
  if (!spell.offGcd) throw new Error(`Developer Error: Spell "${spell.name}" is not off GCD`);

  return spell.effect.reduce((state, effect) => effect(state, spell), state);
};
