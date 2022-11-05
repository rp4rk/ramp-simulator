import { createPlayer } from "lib";
import { SimState } from "lib/types";

export const createMockSimState = (overrides: Partial<SimState> = {}): SimState => {
  return {
    absorb: 0,
    healing: 0,
    damage: 0,
    mana: 0,
    time: 0,
    player: createPlayer(0, 0, 0, 0, 0),
    cooldowns: new Map(),
    buffs: new Map(),
    talents: new Map(),
    ...overrides,
  };
};
