import { useState } from "react";

import { SimOrchestrator } from "components/SimOrchestrator";
import { Card } from "components/Card";
import { SpellSelection } from "components/SpellSelection";
import Header from "components/Header";

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
      <button
        className="block mx-auto text-sm text-white font-semibold py-2 px-4 bg-sky-600 hover:bg-sky-700 rounded-full"
        onClick={() => setSims(sims + 1)}
      >
        Add Simulation
      </button>
    </>
  );
}

export default App;
