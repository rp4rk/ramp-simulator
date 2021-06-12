import { useState, useEffect } from "react";
import { SimOrchestratorContainer } from "./styled";
import { CharacterStats, Stats, initialState } from "components/Stats";
import { Timeline } from "components/Timeline";
import { SimResults } from "components/SimResults";
import { ItemSelector } from "components/ItemSelector";
import { Item, SimState, Spell } from "lib/types";
import { defaultParams, QuickSim } from "lib/spellQueue";
import { createPlayer } from "lib";

export const SimOrchestrator = function SimOrchestrator() {
  const [spells, setSpells] = useState<Spell[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [stats, setStats] = useState<CharacterStats>(initialState);
  const [simResult, setSimResult] = useState<SimState>();

  useEffect(() => {
    if (spells.length === 0) return;

    const player = createPlayer(
      stats.intellect,
      stats.haste,
      stats.mastery,
      stats.crit,
      stats.vers
    );

    const simResult = QuickSim(defaultParams(player), spells, items);

    setSimResult(simResult);
  }, [spells, stats, items]);

  return (
    <SimOrchestratorContainer>
      <Stats onChange={setStats} />
      <ItemSelector onChange={setItems} />
      <Timeline onChange={setSpells} />
      <SimResults simState={simResult} />
    </SimOrchestratorContainer>
  );
};
