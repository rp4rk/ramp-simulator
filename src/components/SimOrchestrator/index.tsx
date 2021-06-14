import { useState, useEffect, useCallback } from "react";
import { SimOrchestratorContainer } from "./styled";
import { CharacterStats, Stats, initialState } from "components/Stats";
import { Timeline } from "components/Timeline";
import { SimResults } from "components/SimResults";
import { ItemSelector } from "components/ItemSelector";
import { Item, SimState, Spell } from "lib/types";
import { defaultParams, QuickSim } from "lib/spellQueue";
import { createPlayer, Spells } from "lib";

export interface UniqueSpell extends Spell {
  identifier: number;
}
export interface SimConfigObject {
  spellNames: string[];
}
export const isSimConfigObject = (config: any): config is SimConfigObject => {
  return "spellNames" in config;
};

function createSimConfig(spells: UniqueSpell[]): SimConfigObject {
  return {
    spellNames: spells.map((s) => s.name),
  };
}

export type SpellDictionary = { [key: string]: Spell };

export const SimOrchestrator = function SimOrchestrator() {
  const [spells, setSpells] = useState<UniqueSpell[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [stats, setStats] = useState<CharacterStats>(initialState);
  const [simResult, setSimResult] = useState<SimState>();

  const setSimulation = useCallback(
    (config: SimConfigObject) => {
      const { spellNames } = config;

      /**
       * Grab spells from our library
       */
      const spells = spellNames.map((name) => {
        const spell = Object.values(Spells).find((s) => s.name === name);

        if (!spell) {
          throw new Error(`Unknown spell - ${name}`);
        }
        return {
          ...spell,
          identifier: new Date().getTime() * Math.random(),
        } as UniqueSpell;
      });

      setSpells(spells);
    },
    [setSpells]
  );

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
      <Timeline setSpells={setSpells} spells={spells} />
      <SimResults
        simState={simResult}
        setSimConfig={setSimulation}
        simConfig={createSimConfig(spells)}
      />
    </SimOrchestratorContainer>
  );
};
