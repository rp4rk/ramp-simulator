import { StateSpellReducer, SimState } from "../types";
import { applyAura } from "./aura";
import { ATONEMENT_BASE_DURATION } from "../spells/Atonement";
import { hasTalent } from "lib/talents";

const ENDURING_LUMINESCENCE_ID = 390685;

/**
 * Midnight (12.0.1) Evangelism Redesign:
 * Instead of extending Atonements, Evangelism now:
 * 1. Casts a free Power Word: Radiance (applies 5 Atonements at reduced duration)
 * 2. Makes your next 2 Radiances instant cast (tracked via "Evangelism" buff with 2 stacks)
 */
export const evangelismExtension: StateSpellReducer = (state, spell): SimState => {
  const hasEnduringLuminescence = hasTalent(state, ENDURING_LUMINESCENCE_ID);
  const atonementDuration = hasEnduringLuminescence
    ? ATONEMENT_BASE_DURATION * 0.7
    : ATONEMENT_BASE_DURATION * 0.6;

  // Apply 5 Atonements from the free Radiance
  const stateWithAtonements = applyAura(
    state,
    {
      name: "Atonement",
      applied: state.time,
      duration: atonementDuration,
    },
    5
  );

  // Apply Evangelism buff: next 2 Radiances are instant
  const stateWithBuff = applyAura(stateWithAtonements, {
    name: "Evangelism",
    duration: 15000,
    stacks: 2,
  });

  return stateWithBuff;
};
