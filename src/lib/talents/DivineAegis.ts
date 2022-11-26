import { getCritPerc } from "lib/player";
import { getTalentPoints } from "lib/talents";
import { StateSpellReducer } from "lib/types";

export const DIVINE_AEGIS_ID = 47515;
export const DIVINE_AEGIS_BENEFIT_PER_POINT = 0.05;

export const calculateCritContribution = (critPerc: number) => ((critPerc - 1) * 2) / critPerc;

export const createDivineAegisShield =
  (healing: number, critBonuses: number[] = []): StateSpellReducer =>
  (state) => {
    const divineAegisPoints = getTalentPoints(state, DIVINE_AEGIS_ID);
    if (divineAegisPoints === 0) return state;
    const divineAegisBonus = divineAegisPoints * DIVINE_AEGIS_BENEFIT_PER_POINT;
    const currCritPerc = getCritPerc(state.player);
    const totalCritBonus = critBonuses.reduce((acc, curr) => acc + curr, 0);

    const critContribution = calculateCritContribution(currCritPerc + totalCritBonus);

    return {
      ...state,
      absorb: state.absorb + healing * divineAegisBonus * critContribution,
    };
  };
