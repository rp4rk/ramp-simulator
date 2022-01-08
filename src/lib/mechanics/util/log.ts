import { StateSpellReducer } from "../../types";
import { SimState, Spell } from "lib/types";

export function log(fn: StateSpellReducer): StateSpellReducer {
  return function (innerState: SimState, spell: Spell) {
    const projectedState = fn(innerState, spell);

    console.log(`[TIME PROJECTION][${innerState.time}]->[${projectedState.time}] Casting ${spell.name}`);

    return projectedState;
  };
}
