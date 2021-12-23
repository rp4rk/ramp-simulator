import { useState, useCallback } from "react";

import { SimOrchestrator } from "components/SimOrchestrator";
import { Card } from "components/Card";
import { SpellSelection } from "components/SpellSelection";
import Header from "components/Header";
import { Button } from "components/Button";

import { v4 } from "uuid";

function App() {
  const [sims, setSims] = useState<string[]>([v4()]);

  const deleteSimulation = useCallback(
    (uuid: string) => {
      const newSims = sims.filter((simId) => simId !== uuid);

      setSims(newSims);
    },
    [sims]
  );

  return (
    <>
      <Header></Header>
      <Card>
        <SpellSelection />
      </Card>
      {sims.map((id) => (
        <Card key={id}>
          <SimOrchestrator deletionAllowed={sims.length > 1} onDelete={() => deleteSimulation(id)} />
        </Card>
      ))}
      <Button className="mx-auto block mb-4" outline icon="PlusCircleIcon" onClick={() => setSims([...sims, v4()])}>
        Add Simulation
      </Button>
    </>
  );
}

export default App;
