import { StateSpellReducer } from "lib/types";

export const cdr =
  (spellName: string, amount: number): StateSpellReducer =>
  (state) => {
    const existingCooldown = state.cooldowns.get(spellName);
    if (!existingCooldown) return state;

    const newCooldown = existingCooldown - amount;
    state.cooldowns.set(spellName, newCooldown);

    return state;
  };
