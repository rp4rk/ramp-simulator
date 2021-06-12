import { SimState } from "lib/types";

type SimResultsProps = {
  simState?: SimState;
};

export const SimResults = function SimResults({ simState }: SimResultsProps) {
  return (
    <div>
      <h4>Results</h4>
      <div>Healing: {simState?.healing || 0}</div>
      <div>Absorb: {simState?.absorb || 0}</div>
      <div>Damage: {simState?.damage || 0}</div>
    </div>
  );
};
