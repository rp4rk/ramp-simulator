import React, { FC } from "react";
import { Player } from "lib/types";

type StatProps = {
  /**
   * A spell from the quicksim library.
   */
  onChange: (stat: keyof Player, amount: number) => any;
  stats: Player;
};

export const Stats: FC<StatProps> = ({ onChange, stats }) => {
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
            value={stats.spellpower || ""}
            onChange={(e) => {
              const value = e.target.value;

              if (value === "" || +value < 0) {
                return onChange("spellpower", 0);
              }

              onChange("spellpower", +value);
            }}
          ></input>
        </li>
        <li className="space-y-2 grid gap-4 grid-cols-2">
          <label className="font-medium">Haste</label>
          <input
            className="p-1"
            type="number"
            name="haste"
            value={stats.haste || ""}
            onChange={(e) => {
              const value = e.target.value;

              if (value === "" || +value < 0) {
                return onChange("haste", 0);
              }

              onChange("haste", +value);
            }}
          ></input>
        </li>
        <li className="space-y-2 grid gap-4 grid-cols-2">
          <label className="font-medium">Mastery</label>
          <input
            className="p-1"
            type="number"
            name="mastery"
            value={stats.mastery || ""}
            onChange={(e) => {
              const value = e.target.value;

              if (value === "" || +value < 0) {
                return onChange("mastery", 0);
              }

              onChange("mastery", +value);
            }}
          ></input>
        </li>
        <li className="space-y-2 grid gap-4 grid-cols-2">
          <label className="font-medium">Critical Strike</label>
          <input
            className="p-1"
            type="number"
            name="crit"
            value={stats.crit || ""}
            onChange={(e) => {
              const value = e.target.value;

              if (value === "" || +value < 0) {
                return onChange("crit", 0);
              }

              onChange("crit", +value);
            }}
          ></input>
        </li>
        <li className="space-y-2 grid gap-4 grid-cols-2">
          <label className="font-medium">Versatility</label>
          <input
            className="p-1"
            type="number"
            name="vers"
            value={stats.vers || ""}
            onChange={(e) => {
              const value = e.target.value;

              if (value === "" || +value < 0) {
                return onChange("vers", 0);
              }

              onChange("vers", +value);
            }}
          ></input>
        </li>
      </ul>
    </div>
  );
};
