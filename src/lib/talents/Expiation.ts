import { OverTime, Spell, SpellCategory, StateSpellReducer } from "lib/types";
import { damage, atonement, cast } from "lib/mechanics";
import { getTalentPoints, hasTalent } from "lib/talents";
import { reduceOvertime } from "../mechanics/extend";
import { getAura } from "lib/buff";
import { getRemainingTicks } from "lib/mechanics/overtime";
import { getHastePerc } from "../player";
import { Calculated } from "../types";

export const EXPIATION_ID = 390832;
const EXPIATION_DECAY_PER_POINT = 3000;
export const EXPIATION_DAMAGE_BONUS_PER_POINT = 0.1;

// Expiation inexplicably hits 20% harder than it should
const MAGIC_IDIOT_EXPIATION_MODIFIER = 1.2;

export const expiationBuff: Calculated = (state) => {
  return 1 + getTalentPoints(state, EXPIATION_ID) * EXPIATION_DAMAGE_BONUS_PER_POINT;
};

const _Expiation: Spell = {
  name: "Expiation",
  id: EXPIATION_ID,
  category: SpellCategory.Ignored,
  icon: "spell_shadow_shadowpower",
  offGcd: true,
  damage: (state) => {
    const expiationPoints = getTalentPoints(state, EXPIATION_ID);
    const ptw = getAura(state, "Purge the Wicked") as OverTime | undefined;
    const swp = getAura(state, "Shadow Word: Pain") as OverTime | undefined;
    const dot = ptw || swp;

    // No DoT = no damage :(
    if (dot === undefined) return 0;
    if (!("interval" in dot)) return 0;

    const remainingTicks = getRemainingTicks(dot, getHastePerc(state.player), state);
    const expiationTimeConsumption = (expiationPoints || 2) * EXPIATION_DECAY_PER_POINT;
    const interval = typeof dot.interval === "function" ? dot.interval(state) : dot.interval;
    const expiationTicksConsumed = expiationTimeConsumption / interval;

    const consumedTickAmount = Math.min(remainingTicks, expiationTicksConsumed);

    // Expiation kind of double dips from haste, the amount it gives is multiplied by the players haste
    const expiationDamage =
      consumedTickAmount *
      dot.coefficient *
      getHastePerc(state.player) *
      MAGIC_IDIOT_EXPIATION_MODIFIER;

    return expiationDamage;
  },
  effect: [
    damage,
    atonement,
    (state, spell) =>
      reduceOvertime(
        "Purge the Wicked",
        EXPIATION_DECAY_PER_POINT * getTalentPoints(state, EXPIATION_ID)
      )(state, spell),
    (state, spell) =>
      reduceOvertime(
        "Shadow Word: Pain",
        EXPIATION_DECAY_PER_POINT * getTalentPoints(state, EXPIATION_ID)
      )(state, spell),
  ],
};

export const Expiation: StateSpellReducer = (state) => {
  if (!hasTalent(state, EXPIATION_ID)) {
    return state;
  }

  return cast(state, _Expiation);
};
