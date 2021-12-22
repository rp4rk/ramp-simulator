import React, { useReducer } from "react";
import { useEffect } from "react";

type StatProps = {
  /**
   * A spell from the quicksim library.
   */
  onChange?: (arg0: CharacterStats) => any;
};

export interface CharacterStats {
  /**
   * The character's intellect rating
   */
  intellect: number;
  /**
   * The character's haste rating
   */
  haste: number;
  /**
   * The character's mastery rating
   */
  mastery: number;
  /**
   * The character's crit rating
   */
  crit: number;
  /**
   * The character's vers rating
   */
  vers: number;
}

interface StatAction {
  type: keyof CharacterStats;
  payload: number;
}

export const initialState: CharacterStats = {
  intellect: 2000,
  haste: 33 * 33,
  mastery: 35 * 25,
  crit: 35 * 10,
  vers: 40 * 5,
};

function statReducer(state: CharacterStats, action: StatAction) {
  switch (action.type) {
    case "intellect":
      return { ...state, intellect: action.payload };
    case "haste":
      return { ...state, haste: action.payload };
    case "mastery":
      return { ...state, mastery: action.payload };
    case "crit":
      return { ...state, crit: action.payload };
    case "vers":
      return { ...state, vers: action.payload };
    default:
      return state;
  }
}

export const Stats = function ({ onChange }: StatProps) {
  const [state, dispatch] = useReducer(statReducer, initialState);

  useEffect(() => {
    if (!onChange) return;

    onChange(state);
  }, [onChange, state]);

  return (
    <div>
      <h4 className="text-lg text-gray-600 font-semibold">Statistics</h4>
      <ul className="list-none text-gray-800">
        <li className="space-y-2 grid gap-4 grid-cols-2">
          <label className="font-medium">Intellect</label>
          <input
            className="p-1"
            type="number"
            name="intellect"
            value={state.intellect}
            onChange={(e) => {
              const value = +e.target.value || 0;
              dispatch({ type: "intellect", payload: value });
            }}
          ></input>
        </li>
        <li className="space-y-2 grid gap-4 grid-cols-2">
          <label className="font-medium">Haste</label>
          <input
            className="p-1"
            type="number"
            name="haste"
            value={state.haste}
            onChange={(e) => {
              const value = +e.target.value || 0;
              dispatch({ type: "haste", payload: value });
            }}
          ></input>
        </li>
        <li className="space-y-2 grid gap-4 grid-cols-2">
          <label className="font-medium">Mastery</label>
          <input
            className="p-1"
            type="number"
            name="mastery"
            value={state.mastery}
            onChange={(e) => {
              const value = +e.target.value || 0;
              dispatch({ type: "mastery", payload: value });
            }}
          ></input>
        </li>
        <li className="space-y-2 grid gap-4 grid-cols-2">
          <label className="font-medium">Critical Strike</label>
          <input
            className="p-1"
            type="number"
            name="crit"
            value={state.crit}
            onChange={(e) => {
              const value = +e.target.value || 0;
              dispatch({ type: "crit", payload: value });
            }}
          ></input>
        </li>
        <li className="space-y-2 grid gap-4 grid-cols-2">
          <label className="font-medium">Versatility</label>
          <input
            className="p-1"
            type="number"
            name="vers"
            value={state.vers}
            onChange={(e) => {
              const value = +e.target.value || 0;
              dispatch({ type: "vers", payload: value });
            }}
          ></input>
        </li>
      </ul>
    </div>
  );
};
