import produce from "immer";
import { RampSpell, SimulationStates } from "./simulations";
import { SimulationStatesAction } from "./simulations.actions";

import * as spellMap from "lib/spells";
import { v4 } from "uuid";

const spells = Object.values(spellMap);

export const simulationsReducer = (
  state: SimulationStates,
  action: SimulationStatesAction
): SimulationStates => {
  switch (action.type) {
    case "ADD_SIMULATION": {
      const { payload } = action;

      return produce(state, (projectedState) => {
        projectedState.simulations = {
          ...projectedState.simulations,
          [payload.guid]: {
            state: payload.sim,
            rampSpells: payload.rampSpells,
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
    case "ADD_SIMULATION_SPELLS": {
      return produce(state, (projectedState) => {
        if (state.focusedSimulation) {
          projectedState.simulations[state.focusedSimulation].rampSpells.push(
            ...action.payload.spells
          );
        } else {
          Object.values(projectedState.simulations)[0].rampSpells.push(...action.payload.spells);
        }
      });
    }
    case "UPDATE_PLAYER_STAT": {
      return produce(state, (projectedState) => {
        projectedState.simulations[action.payload.guid].state.player[action.payload.stat] =
          action.payload.amount;
      });
    }
    case "IMPORT_SIMULATION": {
      const { simulation } = action.payload;
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
                talents: new Map(simulation.simState.talents),
              },
              rampSpells: simulationSpells,
            },
          };

          return;
        }

        projectedState.simulations[v4()] = {
          state: {
            ...simulation.simState,
            buffs: new Map(simulation.simState.buffs),
            cooldowns: new Map(simulation.simState.cooldowns),
            talents: new Map(simulation.simState.talents),
          },
          rampSpells: simulationSpells,
        };
      });
    }
    case "SET_FOCUSED_SIMULATION": {
      return produce(state, (projectedState) => {
        projectedState.focusedSimulation = action.payload.simulation;
      });
    }
    case "SET_SIMULATION_TALENTS": {
      return produce(state, (projectedState) => {
        const generalTalents = action.payload.talents.GENERAL?.selectedTalents?.values();
        const classTalents = action.payload.talents.TREE?.selectedTalents?.values();

        const talentMap = [...(generalTalents || []), ...(classTalents || [])].reduce(
          (talents, talent) => {
            talents.set(talent.talentId, talent);
            return talents;
          },
          new Map()
        );

        projectedState.simulations[action.payload.guid].state.talents = talentMap;
      });
    }
    default:
      return state;
  }
};
