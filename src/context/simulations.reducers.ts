import { createPlayer } from "lib";
import { SimulationStates } from "./simulations";
import { SimulationStatesAction } from "./simulations.actions";

export const simulationsReducer = (state: SimulationStates, action: SimulationStatesAction): SimulationStates => {
  switch (action.type) {
    case "ADD_SIMULATION": {
      const { payload } = action;
      return {
        ...state,
        simulations: {
          ...state.simulations,
          [payload.guid]: {
            state: payload.sim,
            rampSpells: [],
            items: [],
          },
        },
      };
    }
    case "DELETE_SIMULATION": {
      const { simulations } = state;
      const { [action.payload]: _, ...rest } = simulations;
      return {
        ...state,
        simulations: rest,
      };
    }
    case "SET_SIMULATION_SPELLS": {
      const { simulations } = state;
      const { rampSpells, ...rest } = simulations[action.payload.guid];

      return {
        ...state,
        simulations: {
          ...simulations,
          [action.payload.guid]: {
            ...rest,
            rampSpells: action.payload.spells,
          },
        },
      };
    }
    default:
      return state;
  }
};
