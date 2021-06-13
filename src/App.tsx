import { useState } from "react";

import { SpellList } from "components/SpellList";
import { SimOrchestrator } from "components/SimOrchestrator";
import { Card } from "components/Card";

function App() {
  const [sims, setSims] = useState(0);
  return (
    <div>
      <Card
        style={{
          top: 20,
          position: "sticky",
          zIndex: 100,
        }}
      >
        <SpellList />
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
        style={{
          display: "block",
          margin: "48px auto",
          fontSize: "12pt",
          padding: "12px",
        }}
        onClick={() => setSims(sims + 1)}
      >
        +
      </button>
    </div>
  );
}

export default App;
