import { StateSpellReducer, SimState } from "../types";
import { atonement } from "./atonement";
import { damage } from "./damage";
import { AscendedEruption } from "../spells";

/**
 * Casts Ascended Eruption
 */
export const ascendedEruption: StateSpellReducer = (state, spell): SimState => {
  const { time } = state;
  const boonBuffs = state.buffs.get("Boon of the Ascended");

  if (!boonBuffs) return state;
  const lastBoon = boonBuffs[boonBuffs.length - 1];
  if (!lastBoon) return state;

  // Boon hasn't expired yet
  if (time <= lastBoon.expires || lastBoon.consumed) {
    return state;
  }

  lastBoon.consumed = true;
  const projectedState = atonement(
    damage(
      {
        ...state,
        time: lastBoon.expires,
      },
      AscendedEruption
    ),
    AscendedEruption
  );

  return { ...projectedState, time };
};
