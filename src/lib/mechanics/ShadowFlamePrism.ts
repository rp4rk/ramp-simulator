import { StateSpellReducer, SimState } from "../types";
import { damage } from "./damage";
import { atonement } from "./atonement";
import { ShadowFlamePrism } from "lib/spells/ShadowFlamePrism";
import { hasAura } from "../buff";
import { extendAura } from "./aura";

const SHADOWFLAME_PRISM_EXTENSION_MS = 1000;

/**
 * Applies Shadowflame Prism
 */
export const shadowFlamePrism: StateSpellReducer = (state): SimState => {
  if (!hasAura(state, "Mindbender") || !hasAura(state, "Shadowflame Prism")) {
    return state;
  }

  const extendedBuffState = extendAura(state, "Mindbender", SHADOWFLAME_PRISM_EXTENSION_MS);
  const extendedPupperMaster = extendAura(
    extendedBuffState,
    "Puppet Master",
    SHADOWFLAME_PRISM_EXTENSION_MS
  );

  return atonement(damage(extendedPupperMaster, ShadowFlamePrism), ShadowFlamePrism);
};
