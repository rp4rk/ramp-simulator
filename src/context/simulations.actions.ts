import { SimState, Item, Stats } from "lib/types";
import { Action } from "../types";
import { RampSpell } from "./simulations";
import { SerializedSimulationState } from "./simulations.selectors";

interface AddSimulationAction extends Action {
  type: "ADD_SIMULATION";
  payload: {
    guid: string;
    sim: SimState;
    items: Item[];
    rampSpells: RampSpell[];
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

interface AddSimulationItems extends Action {
  type: "ADD_SIMULATION_ITEMS";
  payload: {
    guid: string;
    items: Item[];
  };
}
export const addSimulationItems = (payload: AddSimulationItems["payload"]): AddSimulationItems => ({
  type: "ADD_SIMULATION_ITEMS",
  payload,
});

interface RemoveSimulationItems extends Action {
  type: "REMOVE_SIMULATION_ITEMS";
  payload: {
    guid: string;
    items: Item[];
  };
}
export const removeSimulationItems = (payload: RemoveSimulationItems["payload"]): RemoveSimulationItems => ({
  type: "REMOVE_SIMULATION_ITEMS",
  payload,
});

interface UpdatePlayerStat extends Action {
  type: "UPDATE_PLAYER_STAT";
  payload: {
    guid: string;
    stat: keyof Stats;
    amount: number;
  };
}
export const updatePlayerStat = (payload: UpdatePlayerStat["payload"]): UpdatePlayerStat => ({
  type: "UPDATE_PLAYER_STAT",
  payload,
});

interface ImportSimulation extends Action {
  type: "IMPORT_SIMULATION";
  payload: {
    simulation: SerializedSimulationState;
  };
}
export const importSimulation = (payload: ImportSimulation["payload"]): ImportSimulation => ({
  type: "IMPORT_SIMULATION",
  payload,
});

export type SimulationStatesAction =
  | AddSimulationAction
  | DeleteSimulationAction
  | SetSimulationSpells
  | AddSimulationItems
  | RemoveSimulationItems
  | UpdatePlayerStat
  | ImportSimulation;
