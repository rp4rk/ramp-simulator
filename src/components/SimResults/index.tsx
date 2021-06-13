import { SimState } from "lib/types";

type SimResultsProps = {
  simState?: SimState;
};

export const SimResults = function SimResults({ simState }: SimResultsProps) {
  return (
    <div>
      <h4>Results</h4>
      <div>Healing: {Math.round(simState?.healing || 0)}</div>
      <div>Absorb: {Math.round(simState?.absorb || 0)}</div>
      <div>Damage: {Math.round(simState?.damage || 0)}</div>
      <div>Time: {Math.round((simState?.time || 0) / 1) / 1000}s</div>
      <button onClick={() => console.log(simState)}>Debug</button>
    </div>
  );
};
