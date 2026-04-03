import { executeDoT, executeHoT } from "./mechanics";
import { createPlayer } from "./player";
import { CalculatedBuff, SimState, Spell, SpellQueue } from "./types";
import { applyStats } from "./mechanics/applyStats";
import { mana } from "./mechanics/mana";

type SpellQueueIterator = (
  initialState: SimState,
  queue: SpellQueue,
  buffs?: CalculatedBuff[]
) => SimState;

/**
 * Creates the default player statistics
 */
// Midnight (12.0.1) default stats for level 90 with stat squish
// TODO: Validate against live 12.0.1 gear values
const defaultPlayer = () => createPlayer(1, 20 * 40, 20 * 25, 20 * 10, 120);

/**
 * Creates the initial state for the simulation
 */
export const createInitialState = (
  player = defaultPlayer(),
  overrides: Partial<SimState> = {}
): SimState => ({
  healing: 0,
  damage: 0,
  absorb: 0,
  mana: 0,
  buffs: new Map(),
  time: 0,
  player: player,
  cooldowns: new Map(),
  talents: new Map(),
  ...overrides,
});

/**
 * Handles the evaluation of top-level effects created by the priority list
 */
function reduceState(state: SimState, spell: Spell): SimState {
  const effects = [applyStats, executeDoT, executeHoT, ...(spell.effect || []), mana];

  const projectedState =
    effects.reduce((acc, curr) => {
      return curr(acc, spell);
    }, state) || state;

  return projectedState;
}

/**
 * Main interface point
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
