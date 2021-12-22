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

export const SimResults = function SimResults({ simState, setSimConfig, simConfig }: SimResultsProps) {
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
    <div className="text-gray-800">
      <h4 className="text-lg text-gray-600 font-semibold">Results</h4>
      <div>Healing: {Math.round(simState?.healing || 0)}</div>
      <div>Absorb: {Math.round(simState?.absorb || 0)}</div>
      <div>Damage: {Math.round(simState?.damage || 0)}</div>
      <div>Time: {Math.round((simState?.time || 0) / 1) / 1000}s</div>
      <div className="mt-2">
        <button
          className="text-sm text-white font-semibold py-2 px-4 bg-sky-600 hover:bg-sky-700 rounded-full"
          onClick={() => console.log(simState)}
        >
          Debug
        </button>
        <button
          className="text-sm text-white font-semibold py-2 px-4 bg-sky-600 hover:bg-sky-700 rounded-full"
          onClick={importConfig}
        >
          Import
        </button>
      </div>
      <CopyToClipboard text={serializeSimConfig(simConfig)}>
        <button className="text-sm text-white font-semibold py-2 px-4 bg-sky-600 hover:bg-sky-700 rounded-full">
          Export
        </button>
      </CopyToClipboard>
    </div>
  );
};
