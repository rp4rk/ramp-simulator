import { useState, useEffect, useCallback, FC, useContext } from "react";
import { Stats } from "components/Stats";
import { Timeline } from "components/Timeline";
import { SimResults } from "components/SimResults";
import { ItemSelector } from "components/ItemSelector";
import { Item, Player, SimState } from "lib/types";
import { createInitialState, QuickSim } from "lib/spellQueue";
import { createPlayer } from "lib";
import { Button } from "components/Button";
import CopyToClipboard from "react-copy-to-clipboard";
import { RampSpell, SimulationConfiguration, SimulationsContext } from "context/simulations";
import {
  addSimulationItems,
  removeSimulationItems,
  setSimulationSpells,
  updatePlayerStat,
} from "context/simulations.actions";

interface SimOrchestratorProps {
  simId: string;
  simulationConfiguration: SimulationConfiguration;
  onDelete?: (uuid: string) => void;
  deletionAllowed?: boolean;
}

export const SimOrchestrator: FC<SimOrchestratorProps> = (props) => {
  const { dispatch } = useContext(SimulationsContext);
  const [showConfiguration, setShowConfiguration] = useState<boolean>(false);
  const [simResult, setSimResult] = useState<SimState>();

  /**
   * Run the simulation for this orchestrator
   */
  const spells = props.simulationConfiguration.rampSpells;
  const items = props.simulationConfiguration.items;
  const player = props.simulationConfiguration.state.player;
  useEffect(() => {
    if (spells.length === 0) return;
    const player = createPlayer(2000, 990, 350, 350, 400);

    const simResult = QuickSim(createInitialState(player), spells, items);

    setSimResult(simResult);
  }, [player, items, spells]);

  /**
   * Callbacks for state management
   */
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

  const addItem = useCallback(
    (items: Item[]) => {
      dispatch(
        addSimulationItems({
          guid: props.simId,
          items,
        })
      );
    },
    [props.simId, dispatch]
  );

  const removeItem = useCallback(
    (items: Item[]) => {
      dispatch(
        removeSimulationItems({
          guid: props.simId,
          items,
        })
      );
    },
    [props.simId, dispatch]
  );

  const changeStat = useCallback(
    (stat: keyof Player, amount: number) => {
      dispatch(updatePlayerStat({ guid: props.simId, stat, amount }));
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
          <Stats stats={props.simulationConfiguration.state.player} onChange={changeStat} />
          <ItemSelector items={props.simulationConfiguration.items} onItemAdd={addItem} onItemRemove={removeItem} />
          <SimResults simState={simResult} />
        </div>
      )}
    </div>
  );
};
