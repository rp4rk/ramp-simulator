import { hasAura } from "lib/buff";
import { StateSpellReducer } from "../types";
import { applyAura } from "./aura";
import { executeDoT } from "./overtime";
import { compose } from "./util/compose";

const WickednessAura: StateSpellReducer = (state) => {
  if (!hasAura(state, "Wickedness")) return state;

  return applyAura(state, {
    dot: true,
    name: "Wickedness",
    duration: 6000,
    applied: state.time,
    expires: state.time + 6000,
    interval: 500,
    ticks: 12,
    coefficient: 10,
  });
};

export const Wickedness = compose(WickednessAura, executeDoT);
