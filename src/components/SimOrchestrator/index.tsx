import { useState, useEffect, useCallback, FC } from "react";
import { CharacterStats, Stats, initialState } from "components/Stats";
import { Timeline } from "components/Timeline";
import { SimResults } from "components/SimResults";
import { ItemSelector } from "components/ItemSelector";
import { Item, SimState, Spell } from "lib/types";
import { createInitialState, QuickSim } from "lib/spellQueue";
import { createPlayer, Spells } from "lib";
import { Button } from "components/Button";
import CopyToClipboard from "react-copy-to-clipboard";

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

function serializeSimConfig(config?: SimConfigObject): string {
  if (!config) return "{}";

  return JSON.stringify(config);
}

export type SpellDictionary = { [key: string]: Spell };

interface SimOrchestratorProps {
  onDelete?: () => void;
  deletionAllowed?: boolean;
}

export const SimOrchestrator: FC<SimOrchestratorProps> = (props) => {
  const [showConfiguration, setShowConfiguration] = useState<boolean>(false);
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

  /**
   * Import config callback
   */
  const importConfig = useCallback(async () => {
    const jsonConfigString = window.prompt("Paste a config");
    if (!jsonConfigString) return;

    try {
      const config = JSON.parse(jsonConfigString);
      if (!isSimConfigObject(config)) throw new Error("Bad input");

      setSimulation(config);
    } catch (e) {
      console.log(e);
      console.error("bad paste lol");
    }
  }, [setSimulation]);

  useEffect(() => {
    if (spells.length === 0) return;
    const player = createPlayer(stats.intellect, stats.haste, stats.mastery, stats.crit, stats.vers);

    const simResult = QuickSim(createInitialState(player), spells, items);

    setSimResult(simResult);
  }, [spells, stats, items]);

  return (
    <div>
      <div className="mb-4">
        <div className="flex justify-between mb-4">
          <h4 className="text-lg text-gray-600 font-semibold mb-2">Ramp Timeline</h4>
          <div className="space-x-2">
            <Button outline icon="DownloadIcon" onClick={importConfig}>
              Import
            </Button>
            <CopyToClipboard text={serializeSimConfig(createSimConfig(spells))}>
              <Button outline icon="ShareIcon">
                Export
              </Button>
            </CopyToClipboard>
            <Button onClick={() => setShowConfiguration(!showConfiguration)} outline icon="CogIcon">
              Config
            </Button>
            {props.deletionAllowed && props.onDelete && (
              <Button className="bg-red-500 hover:bg-red-600" onClick={props.onDelete} outline icon="TrashIcon">
                Delete
              </Button>
            )}
          </div>
        </div>
        <Timeline setSpells={setSpells} spells={spells} />
      </div>
      {showConfiguration && (
        <div className="grid grid-cols-3 gap-4">
          <Stats onChange={setStats} />
          <ItemSelector onChange={setItems} />
          <SimResults simState={simResult} />
        </div>
      )}
    </div>
  );
};
