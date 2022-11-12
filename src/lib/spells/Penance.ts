import { consumeAura, hasAura } from "lib/buff";
import { atonement, cooldown, damage, channel } from "lib/mechanics";
import { Channel, SpellCategory } from "lib/types";
import { createManaCost } from "lib/mechanics/mana";
import { Manipulation } from "lib/talents/Manipulation";
import { buildDamage } from "lib/mechanics/util/buildDamage";
import {
  applyTwilightEquilibriumShadow,
  twilightEquilibriumBuff,
  TwilightEquilibriumSchool,
} from "lib/talents/TwilightEquilibrium";
import { blazeOfLightBuff } from "lib/talents/BlazeOfLight";
import { painfulPunishmentPtw, painfulPunishmentSwp } from "../talents/PainfulPunishment";
import { hasTalent } from "lib/talents";
import { applyWealAndWoe } from "../talents/WealAndWoe";
import { powerOfTheDarkSideBuff } from "../talents/PowerOfTheDarkSide";
import { HARSH_DISCIPLINE_ID } from "lib/talents/HarshDiscipline";

const CASTIGATION_ID = 193134;

export const Penance: Channel = {
  category: SpellCategory.Damage,
  channel: true,
  id: 47540,
  icon: "spell_holy_penance",
  name: "Penance",
  cost: (state) => {
    if (hasAura(state, "Harsh Discipline")) return 0;

    return createManaCost(1.6)(state);
  },
  cooldown: 9000,
  ticks: (state) => {
    const hasCastigation = hasTalent(state, CASTIGATION_ID);
    const hasHarshDiscipline =
      hasTalent(state, HARSH_DISCIPLINE_ID) && hasAura(state, "Harsh Discipline");

    return 3 + (hasHarshDiscipline ? 3 : 0) + (hasCastigation ? 1 : 0);
  },
  damage: buildDamage(37.6, [
    twilightEquilibriumBuff(TwilightEquilibriumSchool.Holy),
    blazeOfLightBuff,
    powerOfTheDarkSideBuff,
  ]),
  healing: 375,
  castTime: 2000,
  effect: [
    cooldown,
    Manipulation,
    applyTwilightEquilibriumShadow,
    channel([damage, atonement, painfulPunishmentPtw, painfulPunishmentSwp, applyWealAndWoe]),
    consumeAura("Power of the Dark Side"),
    consumeAura("Harsh Discipline"),
  ],
};
