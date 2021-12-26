import produce from "immer";
import { Item } from "lib/types";
import { SimulationStates } from "./simulations";
import { SimulationStatesAction } from "./simulations.actions";

export const simulationsReducer = (state: SimulationStates, action: SimulationStatesAction): SimulationStates => {
  switch (action.type) {
    case "ADD_SIMULATION": {
      const { payload } = action;

      return produce(state, (projectedState) => {
        projectedState.simulations = {
          ...projectedState.simulations,
          [payload.guid]: {
            state: payload.sim,
            rampSpells: payload.rampSpells,
            items: payload.items,
          },
        };
      });
    }
    case "DELETE_SIMULATION": {
      const { simulations } = state;
      const { [action.payload]: _, ...rest } = simulations;

      return produce(state, (projectedState) => {
        projectedState.simulations = rest;
      });
    }
    case "SET_SIMULATION_SPELLS": {
      return produce(state, (projectedState) => {
        projectedState.simulations[action.payload.guid].rampSpells = action.payload.spells;
      });
    }
    case "ADD_SIMULATION_ITEMS": {
      const targetSimulation = state.simulations[action.payload.guid];
      const newItems: Item[] = [...targetSimulation.items, ...action.payload.items];

      return produce(state, (projectedState) => {
        projectedState.simulations[action.payload.guid].items = newItems;
      });
    }
    case "REMOVE_SIMULATION_ITEMS": {
      const targetSimulation = state.simulations[action.payload.guid];
      const newItems: Item[] = targetSimulation.items.filter((item) =>
        action.payload.items.find((i) => i.id !== item.id)
      );

      return produce(state, (projectedState) => {
        projectedState.simulations[action.payload.guid].items = newItems;
      });
    }
    case "UPDATE_PLAYER_STAT": {
      return produce(state, (projectedState) => {
        projectedState.simulations[action.payload.guid].state.player[action.payload.stat] = action.payload.amount;
      });
    }
    default:
      return state;
  }
};
