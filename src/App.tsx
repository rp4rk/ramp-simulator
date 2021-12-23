import { useState } from "react";

import { SimOrchestrator } from "components/SimOrchestrator";
import { Card } from "components/Card";
import { SpellSelection } from "components/SpellSelection";
import Header from "components/Header";
import { Button } from "components/Button";

function App() {
  const [sims, setSims] = useState(0);
  return (
    <>
      <Header></Header>
      <Card>
        <SpellSelection />
      </Card>
      <Card>
        <SimOrchestrator />
      </Card>
      {Array.from({ length: sims }).map((_, i) => (
        <Card key={i}>
          <SimOrchestrator />
        </Card>
      ))}
      <Button className="mx-auto block" outline icon="PlusCircleIcon" onClick={() => setSims(sims + 1)}>
        Add Simulation
      </Button>
    </>
  );
}

export default App;
