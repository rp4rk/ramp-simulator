import { useState, useEffect, useCallback, FC, useContext } from "react";
import { CharacterStats, Stats, initialState } from "components/Stats";
import { Timeline } from "components/Timeline";
import { SimResults } from "components/SimResults";
import { ItemSelector } from "components/ItemSelector";
import { Item, SimState, Spell } from "lib/types";
import { createInitialState, QuickSim } from "lib/spellQueue";
import { createPlayer, Spells } from "lib";
import { Button } from "components/Button";
import CopyToClipboard from "react-copy-to-clipboard";
import { RampSpell, SimulationConfiguration, SimulationsContext } from "context/simulations";
import { setSimulationSpells } from "context/simulations.actions";

export interface SimConfigObject {
  spellNames: string[];
}

export const isSimConfigObject = (config: any): config is SimConfigObject => {
  return "spellNames" in config;
};

function createSimConfig(spells: RampSpell[]): SimConfigObject {
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
  simId: string;
  simulationConfiguration: SimulationConfiguration;
  onDelete?: (uuid: string) => void;
  deletionAllowed?: boolean;
}

export const SimOrchestrator: FC<SimOrchestratorProps> = (props) => {
  const { dispatch } = useContext(SimulationsContext);
  const [showConfiguration, setShowConfiguration] = useState<boolean>(false);
  const [items, setItems] = useState<Item[]>([]);
  const [stats, setStats] = useState<CharacterStats>(initialState);
  const [simResult, setSimResult] = useState<SimState>();

  const spells = props.simulationConfiguration.rampSpells;
  useEffect(() => {
    if (spells.length === 0) return;
    const player = createPlayer(stats.intellect, stats.haste, stats.mastery, stats.crit, stats.vers);

    const simResult = QuickSim(createInitialState(player), spells, items);

    setSimResult(simResult);
  }, [stats, items, spells]);

  const setSpells = useCallback(
    (spells: RampSpell[]) => {
      dispatch(
        setSimulationSpells({
          guid: props.simId,
          spells,
        })
      );
    },
    [props.simId, dispatch]
  );

  return (
    <div>
      <div className="mb-4">
        <div className="flex justify-between mb-4">
          <h4 className="text-lg text-gray-600 font-semibold mb-2">Ramp Timeline</h4>
          <div className="space-x-2">
            <Button outline icon="DownloadIcon" onClick={console.log}>
              Import
            </Button>
            <CopyToClipboard text={"nah"}>
              <Button outline icon="ShareIcon">
                Export
              </Button>
            </CopyToClipboard>
            <Button onClick={() => setShowConfiguration(!showConfiguration)} outline icon="CogIcon">
              Config
            </Button>
            {props.deletionAllowed && props.onDelete && (
              <Button
                className="bg-red-500 hover:bg-red-600"
                onClick={() => props.onDelete && props.onDelete(props.simId)}
                outline
                icon="TrashIcon"
              >
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
