import { StateSpellReducer, SimState } from "../types";
import { advanceTime } from "./time";

/**
 * Channel wraps the provided reducers, advanceTime does not need to be explicitly stated
 */
export const channel =
  (effects: StateSpellReducer[]): StateSpellReducer =>
  (state, spell): SimState => {
    if (!("channel" in spell)) throw new Error(`Skill Issue: Channel effect on non-channel spell: ${spell.name}`);
    if (spell.castTime === undefined)
      throw new Error(`Skill Issue: Channel without a castTime encountered: ${spell.name}`);

    const ticks = typeof spell.ticks === "function" ? spell.ticks(state) : spell.ticks;
    const { castTime } = spell;
    const channelInterval = castTime / (ticks - 1);

    const effectsToRepeat: StateSpellReducer[] = [...effects, advanceTime];
    const computedEffects = Array<StateSpellReducer[]>(ticks - 1)
      .fill(effectsToRepeat)
      .flat();

    const channelWithDuration = {
      ...spell,
      castTime: channelInterval,
    };

    const projectedState = computedEffects.reduce((currState, currEffect) => {
      return currEffect(currState, channelWithDuration);
    }, state);

    return projectedState;
  };