import produce from "immer";
import { Item } from "lib/types";
import { RampSpell, SimulationStates } from "./simulations";
import { SimulationStatesAction } from "./simulations.actions";

import * as spellMap from "lib/spells";
import * as itemMap from "lib/items";
import { v4 } from "uuid";

const spells = Object.values(spellMap);
const items = Object.values(itemMap);

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
    case "IMPORT_SIMULATION": {
      const { simulation } = action.payload;
      const simulationItems = simulation.items.map((item) => items.find((i) => i.id === item)) as Item[];
      const simulationSpells = simulation.rampSpells.map((spell) => {
        const foundSpell = spells.find((s) => s.id === spell);
        if (!foundSpell) return undefined;

        return {
          ...foundSpell,
          guid: `${foundSpell.id}-${v4()}`,
        };
      }) as RampSpell[];

      return produce(state, (projectedState) => {
        const existingSimulations = Object.values(state.simulations);

        if (existingSimulations.length === 1 && existingSimulations[0].rampSpells.length === 0) {
          projectedState.simulations = {
            [v4()]: {
              state: {
                ...simulation.simState,
                buffs: new Map(simulation.simState.buffs),
                cooldowns: new Map(simulation.simState.cooldowns),
              },
              rampSpells: simulationSpells,
              items: simulationItems,
            },
          };

          return;
        }

        projectedState.simulations[v4()] = {
          state: {
            ...simulation.simState,
            buffs: new Map(simulation.simState.buffs),
            cooldowns: new Map(simulation.simState.cooldowns),
          },
          rampSpells: simulationSpells,
          items: simulationItems,
        };
      });
    }
    default:
      return state;
  }
};
