import { atonement, damage } from "./mechanics";
import { AscendedEruption } from "./spells";
import { StateSpellReducer, SimState } from "./types";

/**
 * Casts Ascended Eruption
 * @param state
 * @param spell
 * @returns
 */
export const Eruption: StateSpellReducer = (state, spell): SimState => {
  const { time } = state;
  const boonBuffs = state.buffs.get("Boon of the Ascended");

  if (!boonBuffs) return state;
  const lastBoon = boonBuffs[boonBuffs.length - 1];
  if (!lastBoon) return state;

  // Boon hasn't expired yet
  if (time < lastBoon.expires || lastBoon.consumed) {
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

  return projectedState;
};
