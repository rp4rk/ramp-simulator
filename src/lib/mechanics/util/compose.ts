import { StateSpellReducer } from "../../types";

export function compose(...fns: StateSpellReducer[]): StateSpellReducer {
  return (state, spell) => {
    return fns.reduce((acc, fn) => fn(acc, spell), state);
  };
}
