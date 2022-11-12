import { hasAura } from "lib/buff";
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
    const hasHarshDiscipline = hasAura(state, "Harsh Discipline");

    return 3 + (hasHarshDiscipline ? 3 : 0);
  },
  damage: buildDamage(37.6, [
    twilightEquilibriumBuff(TwilightEquilibriumSchool.Holy),
    blazeOfLightBuff,
  ]),
  healing: 375,
  castTime: 2000,
  effect: [
    cooldown,
    Manipulation,
    applyTwilightEquilibriumShadow,
    channel([damage, atonement, painfulPunishmentPtw, painfulPunishmentSwp]),
  ],
};
