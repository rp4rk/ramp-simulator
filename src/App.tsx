import { useCallback, useContext, useEffect, useMemo } from "react";
import rfdc from "rfdc";

import { SimOrchestrator } from "components/SimOrchestrator";
import { Card } from "components/Card";
import { SpellSelection } from "components/SpellSelection";
import Header from "components/Header";
import { Button } from "components/Button";

import { v4 } from "uuid";
import { SimulationsContext } from "context/simulations";
import { deleteSimulation, addSimulation } from "context/simulations.actions";
import { createPlayer } from "lib";
import { createInitialState } from "lib/spellQueue";

const clone = rfdc();

function App() {
  const { state, dispatch } = useContext(SimulationsContext);
  const primarySim = Object.values(state.simulations)[0];

  const deleteSim = useCallback(
    (uuid: string) => {
      dispatch(deleteSimulation(uuid));
    },
    [dispatch]
  );

  const addSim = useCallback(() => {
    const simulationId = v4();

    if (primarySim) {
      const simClone = clone(primarySim);

      dispatch(
        addSimulation({
          guid: simulationId,
          sim: simClone.state,
          rampSpells: simClone.rampSpells,
          items: simClone.items,
        })
      );
    }
  }, [dispatch, primarySim]);

  // Memoize the sim entries and the count
  const [sims, simCount] = useMemo(() => {
    const simEntries = Object.entries(state.simulations);

    return [simEntries, simEntries.length];
  }, [state.simulations]);

  return (
    <>
      <Header></Header>
      <Card className=" z-50">
        <SpellSelection />
      </Card>
      {sims.map(([id, config]) => (
        <Card key={id}>
          <SimOrchestrator
            deletionAllowed={simCount > 1}
            onDelete={deleteSim}
            simId={id}
            simulationConfiguration={config}
          />
        </Card>
      ))}
      <Button className="mx-auto block mb-4" outline icon="PlusCircleIcon" onClick={addSim}>
        Add Simulation
      </Button>
    </>
  );
}

export default App;
