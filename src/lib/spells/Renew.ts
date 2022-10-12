import { advanceTime, applyAura, executeHoT, healing } from "lib/mechanics";
import { createManaCost } from "lib/mechanics/mana";
import { Spell, SpellCategory } from "../types";
import { applyAtonement } from "./Atonement";
import { getHastePerc } from "../player";
import { TrainOfThought } from "lib/talents/TrainOfThought";

export const Renew: Spell = {
  id: 139,
  name: "Renew",
  icon: "spell_holy_renew",
  category: SpellCategory.Applicator,
  metadata: ["Applicator"],
  cost: createManaCost(1.8),
  healing: 32,
  effect: [
    (state) =>
      applyAura(state, {
        name: "Renew",
        hot: true,
        applied: state.time,
        duration: 15_000,
        interval: (state) => 3000 / getHastePerc(state.player),
        ticks: 5,
        coefficient: 32,
      }),
    healing,
    applyAtonement,
    TrainOfThought,
    executeHoT,
    advanceTime,
  ],
};
