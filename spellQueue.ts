import { executeDoT } from "./mechanics";
import { Eruption } from "./middleware";
import { Buff, SimState, Spell, SpellQueue } from "./types";

type SpellQueueIterator = (
  initialState: SimState,
  queue: SpellQueue,
  buffs?: Buff[]
) => SimState;

function reduceState(state: SimState, spell: Spell): SimState {
  const effects = [executeDoT, Eruption, ...(spell.effect || [])];

  return (
    effects.reduce((acc, curr) => {
      return curr(acc, spell);
    }, state) || state
  );
}

export const iterator: SpellQueueIterator = (
  state: SimState,
  queue: SpellQueue,
  initialAuras?: Buff[]
) => {
  initialAuras?.forEach((buff) => {
    state.buffs.set(buff.name, [buff]);
  });

  return queue.reduce(reduceState, state);
};
