import { hasAura } from "lib/buff";
import { atonement, damage, extendOvertime } from "lib/mechanics";
import { cast } from "lib/mechanics/cast";
import { getTalentPoints, hasTalent } from "lib/talents";
import { Spell, SpellCategory, StateSpellReducer } from "lib/types";

const INESCAPABLE_TORMENT_ID = 373427;
const INESCAPABLE_TORMENT_COEFFICIENT_PER_POINT = 58.25;
const INESCAPABLE_TORMENT_EXTENSION_PER_POINT = 500;

const _InescapableTorment: Spell = {
  category: SpellCategory.Ignored,
  id: INESCAPABLE_TORMENT_ID,
  icon: "spell_shadow_unholyfrenzy",
  name: "Inescapable Torment",
  offGcd: true,
  damage: (state) => {
    const talentPoints = getTalentPoints(state, INESCAPABLE_TORMENT_ID);
    return talentPoints * INESCAPABLE_TORMENT_COEFFICIENT_PER_POINT;
  },
  effect: [
    damage,
    atonement,
    (state, spell) =>
      extendOvertime(
        "Mindbender",
        INESCAPABLE_TORMENT_EXTENSION_PER_POINT * getTalentPoints(state, INESCAPABLE_TORMENT_ID)
      )(state, spell),
  ],
};

export const InescapableTorment: StateSpellReducer = (state) => {
  if (!hasTalent(state, INESCAPABLE_TORMENT_ID) || !hasAura(state, "Mindbender")) {
    return state;
  }

  return cast(state, _InescapableTorment);
};
