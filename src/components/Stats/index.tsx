import { FC } from "react";
import { Player, Stats as StatsType } from "lib/types";

type StatProps = {
  /**
   * A spell from the quicksim library.
   */
  onChange: (stat: keyof StatsType, amount: number) => any;
  stats: Player;
};

type StatisticProps = {
  name: string;
  value?: number;
  stat: keyof StatsType;
  onChange: (stat: keyof StatsType, amount: number) => any;
};

const Statistic: FC<StatisticProps> = (props) => {
  return (
    <fieldset className="grid grid-cols-2 space-y-2 items-center w-64">
      <label>{props.name}</label>
      <input
        className="p-1 rounded "
        type="number"
        name={props.name}
        value={props.value || ""}
        onChange={(e) => {
          const value = e.target.value;

          if (value === "" || +value < 0) {
            return props.onChange(props.stat, 0);
          }

          props.onChange(props.stat, +value);
        }}
      ></input>
    </fieldset>
  );
};

export const Stats: FC<StatProps> = ({ onChange, stats }) => {
  return (
    <div className="font-sans">
      <h4 className="text-lg text-gray-700 font-semibold mb-2">Statistics</h4>

      <div className="flex flex-col">
        <Statistic
          name="Intellect"
          onChange={onChange}
          stat="spellpower"
          value={stats.spellpower}
        ></Statistic>
        <Statistic name="Haste" onChange={onChange} stat="haste" value={stats.haste}></Statistic>
        <Statistic
          name="Mastery"
          onChange={onChange}
          stat="mastery"
          value={stats.mastery}
        ></Statistic>
        <Statistic
          name="Critical Strike"
          onChange={onChange}
          stat="crit"
          value={stats.crit}
        ></Statistic>
        <Statistic
          name="Versatility"
          onChange={onChange}
          stat="vers"
          value={stats.vers}
        ></Statistic>
      </div>
    </div>
  );
};
