import { numBuffsActive } from "lib/buff";
import { Channel, SimState, Spell } from "lib/types";
import { OverTime } from "../types";

const SINS_TOTAL = 0.3;
const SINS_MAP = {
  5: 0,
  8: 0.04,
  11: 0.03,
  13: 0.02,
  15: 0.01,
  18: 0.005,
  20: 0.0025,
};
const SINS_MAP_ENTRIES = Object.entries(SINS_MAP);
const IGNORED_SPELLS = new Set(["Mindbender", "Shadowfiend"]);

export const calculateSinsDamageBonus = (
  state: SimState,
  spell?: Spell | OverTime | Channel
): number => {
  const atonementCount = numBuffsActive(state, "Atonement");
  if (spell && IGNORED_SPELLS.has(spell.name)) return 1;

  const [bonus] = SINS_MAP_ENTRIES.reduce(
    ([bonus, stacks, prevThreshold], [stackThreshold, penalty]) => {
      const delta = Math.min(stacks, +stackThreshold - +prevThreshold);
      const newBonus = bonus - delta * penalty;

      return [newBonus, stacks - delta, +stackThreshold];
    },
    [SINS_TOTAL, atonementCount, 0]
  );

  return 1 + bonus;
};
