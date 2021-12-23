import { SimState } from "lib/types";

type SimResultsProps = {
  simState?: SimState;
};

export const SimResults = function SimResults({ simState }: SimResultsProps) {
  return (
    <div className="text-gray-800">
      <h4 className="text-lg text-gray-600 font-semibold">Results</h4>
      <div>
        <span className="text-md font-semibold text-gray-600">Healing: </span>
        {Math.round(simState?.healing || 0)}
      </div>
      <div>
        <span className="text-md font-semibold text-gray-600">Absorbs: </span>
        {Math.round(simState?.absorb || 0)}
      </div>
      <div>
        <span className="text-md font-semibold text-gray-600">Damage: </span>
        {Math.round(simState?.damage || 0)}
      </div>
      <div>
        <span className="text-md font-semibold text-gray-600">Duration: </span>
        {Math.round((simState?.time || 0) / 1) / 1000}s
      </div>
    </div>
  );
};
