import { CopyToClipboard } from "react-copy-to-clipboard";
import { isSimConfigObject, SimConfigObject } from "components/SimOrchestrator";
import { SimState } from "lib/types";
import { useCallback } from "react";

type SimResultsProps = {
  simState?: SimState;
  setSimConfig: (arg0: SimConfigObject) => void;
  simConfig: SimConfigObject;
};

function serializeSimConfig(config?: SimConfigObject): string {
  if (!config) return "{}";

  return JSON.stringify(config);
}

export const SimResults = function SimResults({
  simState,
  setSimConfig,
  simConfig,
}: SimResultsProps) {
  /**
   * Import config callback
   */
  const importConfig = useCallback(async () => {
    const jsonConfigString = window.prompt("Paste a config");
    if (!jsonConfigString) return;

    try {
      const config = JSON.parse(jsonConfigString);
      if (!isSimConfigObject(config)) throw new Error("Bad input");

      setSimConfig(config);
    } catch (e) {
      console.log(e);
      console.error("bad paste lol");
    }
  }, [setSimConfig]);

  return (
    <div>
      <h4>Results</h4>
      <div>Healing: {Math.round(simState?.healing || 0)}</div>
      <div>Absorb: {Math.round(simState?.absorb || 0)}</div>
      <div>Damage: {Math.round(simState?.damage || 0)}</div>
      <div>Time: {Math.round((simState?.time || 0) / 1) / 1000}s</div>
      <button onClick={() => console.log(simState)}>Debug</button>
      <button onClick={importConfig}>Import</button>
      <CopyToClipboard text={serializeSimConfig(simConfig)}>
        <button>Export</button>
      </CopyToClipboard>
    </div>
  );
};
