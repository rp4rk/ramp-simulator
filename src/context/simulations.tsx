import { Item, SimState, Spell } from "lib/types";
import { createContext, FC, useReducer, Dispatch, useMemo } from "react";
import { simulationsReducer } from "./simulations.reducers";
import { SimulationStatesAction } from "./simulations.actions";

// RampSpell is a spell that has been placed into a ramp simulation
export interface RampSpell extends Spell {
  guid: string;
}

export interface SimulationConfiguration {
  // The initial simulation state
  state: SimState;
  // The spells used for this simulation, in order
  rampSpells: RampSpell[];
  // The items used for this simulation
  items: Item[];
}

// A mapping of simulations to their respective initial states and configurations
export interface SimulationStates {
  simulations: {
    [key: string]: SimulationConfiguration;
  };
  focusedSimulation?: string;
}

const initialState: SimulationStates = {
  simulations: {},
  focusedSimulation: undefined,
};

const SimulationsContext = createContext<{
  state: SimulationStates;
  dispatch: Dispatch<SimulationStatesAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

SimulationsContext.displayName = "Simulations Context";

const SimulationsProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(simulationsReducer, initialState);
  const memoizedValue = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return (
    <SimulationsContext.Provider value={memoizedValue}>{children}</SimulationsContext.Provider>
  );
};

export { SimulationsContext, SimulationsProvider };
