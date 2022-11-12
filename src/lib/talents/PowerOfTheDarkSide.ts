import { hasAura } from "lib/buff";
import { applyAura } from "lib/mechanics";
import { hasTalent } from "lib/talents";
import { Spell, SpellCategory } from "lib/types";
import { Calculated } from "../types";

const POWER_OF_THE_DARK_SIDE_ID = 198068;
const POWER_OF_THE_DARK_SIDE_BUFF = 0.3;

const DARK_INDULGENCE_ID = 372972;
const DARK_INDULGENCE_BUFF = 0.2;

export const powerOfTheDarkSideBuff: Calculated = (state) => {
  const hasPowerOfTheDarkSide = hasTalent(state, POWER_OF_THE_DARK_SIDE_ID);
  const hasDarkIndulgence = hasTalent(state, DARK_INDULGENCE_ID);
  const hasPowerOfTheDarkSideBuff = hasAura(state, "Power of the Dark Side");

  if (!hasPowerOfTheDarkSideBuff) return 1;

  if (hasPowerOfTheDarkSide && hasDarkIndulgence) {
    return 1 + POWER_OF_THE_DARK_SIDE_BUFF + DARK_INDULGENCE_BUFF;
  }

  if (hasPowerOfTheDarkSide) {
    return 1 + POWER_OF_THE_DARK_SIDE_BUFF;
  }

  return 1;
};

export const PowerOfTheDarkSide: Spell = {
  category: SpellCategory.Buff,
  id: 10060,
  icon: "inv_artifact_powerofthedarkside",
  name: "Power of the Dark Side",
  offGcd: true,
  effect: [
    (state) =>
      applyAura(state, {
        name: "Power of the Dark Side",
        duration: 20_000,
      }),
  ],
};
