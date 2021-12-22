import { executeDoT } from "./mechanics";
import { Eruption } from "./middleware";
import { createPlayer } from "./player";
import { Buff, CalculatedBuff, SimState, Spell, SpellQueue } from "./types";

type SpellQueueIterator = (initialState: SimState, queue: SpellQueue, buffs?: CalculatedBuff[]) => SimState;

const defaultPlayer = () => createPlayer(1, 33 * 40, 35 * 25, 35 * 10, 202);

export const defaultParams = (player = defaultPlayer()): SimState => ({
  healing: 0,
  damage: 0,
  absorb: 0,
  buffs: new Map(),
  time: 0,
  player: player,
  cooldowns: new Map(),
});

/**
 * Handles the evaluation of top-level effects created by the priority list
 * @param state
 * @param spell
 * @returns
 */
function reduceState(state: SimState, spell: Spell): SimState {
  const effects = [executeDoT, ...(spell.effect || []), Eruption];

  const projectedState =
    effects.reduce((acc, curr) => {
      return curr(acc, spell);
    }, state) || state;

  return projectedState;
}

/**
 * Main interface point
 * @param state
 * @param queue
 * @param initialAuras
 * @returns
 */
export const QuickSim: SpellQueueIterator = (
  state: SimState,
  queue: SpellQueue,
  initialAuras?: CalculatedBuff[],
  onComplete?: (arg0: SimState) => any
) => {
  initialAuras?.forEach((buff) => {
    state.buffs.set(buff.name, [buff]);
  });

  const result = queue.reduce(reduceState, state);

  if (onComplete) {
    onComplete(result);
  }

  return result;
};
