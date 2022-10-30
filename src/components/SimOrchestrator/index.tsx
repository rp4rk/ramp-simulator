import { useState, useEffect, useCallback, FC, useContext, memo } from "react";
import { Stats } from "components/Stats";
import { Timeline } from "components/Timeline";
import { SimResults } from "components/SimResults";
import { ItemSelector } from "components/ItemSelector";
import { Item, SimState, Stats as StatsType } from "lib/types";
import { createInitialState, QuickSim } from "lib/spellQueue";
import { createPlayer } from "lib";
import { Button } from "components/Button";
import UnfocusedWill from "./unfocused-will.webp";

import { RampSpell, SimulationConfiguration, SimulationsContext } from "context/simulations";
import {
  addSimulationItems,
  removeSimulationItems,
  setSimulationSpells,
  setSimulationTalents,
  updatePlayerStat,
} from "context/simulations.actions";
// import { CopyToClipboard } from "react-copy-to-clipboard";
// import { getSerializableConfiguration } from "context/simulations.selectors";
// import lzbase62 from "lzbase62";
import { setFocusedSimulation } from "../../context/simulations.actions";
import { TalentWindow } from "components/TalentModal";
import { TalentSetReturn } from "@focused-will/components";

interface SimOrchestratorProps {
  simId: string;
  simulationConfiguration: SimulationConfiguration;
  onDelete?: (uuid: string) => void;
  deletionAllowed?: boolean;
}

export const SimOrchestrator: FC<SimOrchestratorProps> = memo((props) => {
  const { simId } = props;
  const { state, dispatch } = useContext(SimulationsContext);
  const [showConfiguration, setShowConfiguration] = useState<boolean>(false);
  const [showTalentModal, setShowTalentModal] = useState<boolean>(false);
  const [simResult, setSimResult] = useState<SimState>();
  const isFocused = state.focusedSimulation === simId;

  /**
   * Run the simulation for this orchestrator
   */
  const spells = props.simulationConfiguration.rampSpells;
  const items = props.simulationConfiguration.items;
  const player = props.simulationConfiguration.state.player;
  const talents = props.simulationConfiguration.state.talents;
  useEffect(() => {
    if (spells.length === 0) return;

    // Run simulation with existing player template
    if (state.simulations[simId]) {
      const simResult = QuickSim(createInitialState(player, { talents }), spells, items);
      setSimResult(simResult);
    } else {
      const player = createPlayer(2000, 990, 350, 350, 400);
      const simResult = QuickSim(createInitialState(player, { talents }), spells, items);
      setSimResult(simResult);
    }
  }, [player, items, spells, simId, state.simulations, talents]);

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

  const setTalents = useCallback(
    (talentResults: TalentSetReturn) => {
      dispatch(
        setSimulationTalents({
          guid: props.simId,
          talents: talentResults,
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
    (stat: keyof StatsType, amount: number) => {
      dispatch(updatePlayerStat({ guid: props.simId, stat, amount }));
    },
    [props.simId, dispatch]
  );

  const focusSim = useCallback(
    () => dispatch(setFocusedSimulation({ simulation: simId })),
    [dispatch, simId]
  );
  const unfocusSim = useCallback(
    () => dispatch(setFocusedSimulation({ simulation: undefined })),
    [dispatch]
  );

  // const compressedSimState = useMemo(() => {
  //   const serializableConfig = getSerializableConfiguration(state.simulations[props.simId]);
  //   const compressed = lzbase62.compress(JSON.stringify(serializableConfig));

  //   return `ramp-${compressed}`;
  // }, [props.simId, state.simulations]);

  return (
    <div>
      {showTalentModal && (
        <TalentWindow onSave={setTalents} onClose={() => setShowTalentModal(false)} />
      )}
      <div className="mb-4">
        <div className="flex justify-between mb-4">
          <h4 className="text-lg text-gray-600 font-semibold mb-2">Ramp Timeline</h4>
          <div className="space-x-2">
            <Button icon="LightningBoltIcon" onClick={() => setShowTalentModal(true)}>
              Talents
            </Button>
            {(isFocused && (
              <Button onClick={unfocusSim}>
                <img alt="unfocus icon" className="w-5 mr-1 inline-block" src={UnfocusedWill} />{" "}
                Unfocus
              </Button>
            )) || (
              <Button onClick={focusSim} icon="EyeIcon">
                Focus
              </Button>
            )}
            {/* <CopyToClipboard text={compressedSimState}>
              <Button outline icon="ShareIcon">
                Export
              </Button>
            </CopyToClipboard> */}
            <Button onClick={() => setShowConfiguration(!showConfiguration)} outline icon="CogIcon">
              Config
            </Button>
            {props.deletionAllowed && props.onDelete && (
              <Button
                className="bg-red-500 hover:bg-red-600"
                onClick={() => {
                  if (isFocused) {
                    unfocusSim();
                  }
                  props.onDelete && props.onDelete(props.simId);
                }}
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
          <ItemSelector
            items={props.simulationConfiguration.items}
            onItemAdd={addItem}
            onItemRemove={removeItem}
          />
          <SimResults simState={simResult} />
        </div>
      )}
    </div>
  );
});
