import { applyAura } from "lib/mechanics";
import { SimState } from "../types";

export const ATONEMENT_BASE_DURATION = 15000;
export const applyAtonement = (state: SimState) =>
  applyAura(state, {
    name: "Atonement",
    applied: state.time,
    duration: (state) => {
      return ATONEMENT_BASE_DURATION;
    },
  });
