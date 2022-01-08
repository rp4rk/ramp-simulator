import { StateSpellReducer, SimState } from "../types";

/**
 * Advances the simulation to the time at which the provided cooldown is ready, if required
 */
export const cooldown: StateSpellReducer = (state, spell): SimState => {
  if ("interval" in spell) return state;
  if (!spell.cooldown) return state;

  // Advance time if needed
  const lastCastRefreshTime = state.cooldowns.get(spell.name) || 0;
  const shouldTimeTravel = lastCastRefreshTime > state.time;
  const newTime = shouldTimeTravel ? lastCastRefreshTime : state.time;

  // Calculate cooldown
  const initialCooldown = typeof spell.cooldown === "function" ? spell.cooldown(state) : spell.cooldown;

  state.cooldowns.set(spell.name, state.time + initialCooldown);

  return {
    ...state,
    time: newTime,
  };
};
