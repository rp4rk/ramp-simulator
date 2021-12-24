import { SimState } from "lib/types";
import { Action } from "../types";
import { RampSpell } from "./simulations";

interface AddSimulationAction extends Action {
  type: "ADD_SIMULATION";
  payload: {
    guid: string;
    sim: SimState;
  };
}
export const addSimulation = (payload: AddSimulationAction["payload"]): AddSimulationAction => ({
  type: "ADD_SIMULATION",
  payload,
});

interface DeleteSimulationAction extends Action {
  type: "DELETE_SIMULATION";
  payload: string;
}

export const deleteSimulation = (payload: DeleteSimulationAction["payload"]): DeleteSimulationAction => ({
  type: "DELETE_SIMULATION",
  payload,
});

interface SetSimulationSpells extends Action {
  type: "SET_SIMULATION_SPELLS";
  payload: {
    guid: string;
    spells: RampSpell[];
  };
}

export const setSimulationSpells = (payload: SetSimulationSpells["payload"]): SetSimulationSpells => ({
  type: "SET_SIMULATION_SPELLS",
  payload,
});

export type SimulationStatesAction = AddSimulationAction | DeleteSimulationAction | SetSimulationSpells;
