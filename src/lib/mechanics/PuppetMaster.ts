import { hasAura } from "lib/buff";
import { Buff, StatBuffType, StateSpellReducer } from "lib/types";
import { StatBuff } from "../types";
import { applyStats } from "./applyStats";
import { applyAura } from "./aura";

const PuppetMasterStatBuff: StatBuff = {
  stat: "mastery",
  amount: 150,
  type: StatBuffType.RATING,
};

const createPuppetMasterBuff = (duration: number, expires: number): Buff => ({
  name: "Puppet Master",
  duration,
  expires,
  statBuff: PuppetMasterStatBuff,
});

export const PuppetMaster: StateSpellReducer = (state, spell) => {
  if (!hasAura(state, "Puppet Master Talent")) return state;

  if (spell.name === "Mindbender") {
    return applyStats(applyAura(state, createPuppetMasterBuff(12_000, state.time + 12_000)), spell);
  }

  if (spell.name === "Shadowfiend") {
    return applyStats(applyAura(state, createPuppetMasterBuff(15_000, state.time + 15_000)), spell);
  }

  return state;
};
