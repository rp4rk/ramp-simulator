import { hasAura } from "lib/buff";
import { applyAura } from "lib/mechanics";
import { SimState } from "../types";

const ATONEMENT_BASE_DURATION = 15000;
export const applyAtonement = (state: SimState) =>
  applyAura(state, {
    name: "Atonement",
    applied: state.time,
    duration: (state) => {
      const hasClarityOfMind = hasAura(state, "Clarity of Mind");
      const hasRaptureActive = hasAura(state, "Rapture");
      const bonusDuration = hasClarityOfMind && hasRaptureActive ? 6000 : 0;

      return ATONEMENT_BASE_DURATION + bonusDuration;
    },
  });
