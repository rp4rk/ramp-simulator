import { SimState } from "lib/types";
import { Serializable } from "types";
import { SimulationConfiguration } from "./simulations";

export interface SerializedSimulationState {
  simState: Serializable<SimState>;
  rampSpells: Serializable<number[]>;
  items: Serializable<number[]>;
}

export const isSerializedSimulationState = (x: object): x is SerializedSimulationState => {
  if (!("simState" in x)) return false;
  if (!("rampSpells" in x)) return false;
  if (!("items" in x)) return false;
  return true;
};

interface hasId {
  id: number;
}

const itemHasId = (item: Partial<hasId>): item is hasId => {
  return "id" in item;
};

/**
 * Converts an array of objects with IDs to a list of IDs
 */
const toIdList = (idList: Partial<hasId>[]): number[] => {
  const itemsWithIds = idList.filter((item): item is hasId => itemHasId(item));
  return itemsWithIds.map((item) => item.id);
};

/**
 * Returns the simulation config in a serializable form for storage
 */
export const getSerializableConfiguration = (simConfig: SimulationConfiguration): SerializedSimulationState => {
  const { state, rampSpells, items } = simConfig;
  const spellIdList = toIdList(rampSpells);

  return {
    simState: {
      ...state,
      buffs: [...state.buffs.entries()],
      cooldowns: [...state.cooldowns.entries()],
    },
    items: items.map(({ id }) => id),
    rampSpells: spellIdList,
  };
};
