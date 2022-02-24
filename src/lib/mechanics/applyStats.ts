import { StateSpellReducer, SimState, Player, StatBuff } from "../types";
import { advanceTime } from "./time";
import { getStatBuffs } from "../buff";

export const applyStats: StateSpellReducer = (state, spell): SimState => {
  const { time } = state;
  const { time: projectedTime } = advanceTime(state, spell);

  const activeBuffs = getStatBuffs(state);
  const playerWithBuffs = activeBuffs.reduce((currPlayer, currBuff) => {
    if (!currBuff.statBuff) return currPlayer;

    // If the application time is between the two times, apply the buff
    if (time <= currBuff.applied && projectedTime > currBuff.applied) {
      if (currPlayer.statBuffs[currBuff.statBuff.stat].includes(currBuff.statBuff))
        return currPlayer;
      return applyStat(currPlayer, currBuff.statBuff);
    }

    // If the current simulation time is after the buff expires, remove it
    if (time >= currBuff.expires) {
      return removeStat(currPlayer, currBuff.statBuff);
    }

    return currPlayer;
  }, state.player);

  return {
    ...state,
    player: playerWithBuffs,
  };
};

/**
 * Returns a new Player with the stat buff applied
 */
const applyStat = (player: Player, statBuff: StatBuff): Player => {
  const { statBuffs } = player;

  return {
    ...player,
    statBuffs: {
      ...statBuffs,
      [statBuff.stat]: [...statBuffs[statBuff.stat], statBuff],
    },
  };
};

/**
 * Returns a new Player with the stat buff removed
 */
const removeStat = (player: Player, statBuff: StatBuff): Player => {
  const { statBuffs } = player;

  return {
    ...player,
    statBuffs: {
      ...statBuffs,
      [statBuff.stat]: statBuffs[statBuff.stat].filter((s) => s !== statBuff),
    },
  };
};
