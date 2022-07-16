import { createPlayer } from "../player";
import { CalculatedBuff, SimState } from "../types";
import { extendAura } from "./aura";

const createMockSimState = (overrides: Partial<SimState> = {}): SimState => {
  return {
    absorb: 0,
    healing: 0,
    damage: 0,
    mana: 0,
    time: 0,
    player: createPlayer(0, 0, 0, 0, 0),
    cooldowns: new Map(),
    buffs: new Map(),
    ...overrides,
  };
};

const createMockBuff = (overrides: Partial<CalculatedBuff> = {}): CalculatedBuff => ({
  applied: 0,
  duration: 0,
  expires: 0,
  name: "test aura",
  ...overrides,
});

describe("extendAura", () => {
  const testAura = createMockBuff({
    applied: 0,
    duration: 10_000,
    expires: 10_000,
    name: "test aura",
  });

  it("extends an aura", () => {
    const sut = createMockSimState({
      time: 1000,
      buffs: new Map([["test aura", [testAura]]]),
    });

    const newState = extendAura(sut, testAura.name, 1000);
    const extendedAura = newState.buffs.get(testAura.name);

    if (!extendedAura) {
      throw new Error("Aura does not exist for whatever reason");
    }
    if (!extendedAura[0]) {
      throw new Error("Instance of aura does not exist for whatever reason");
    }

    const auraExpiration = extendedAura[0].expires;

    expect(auraExpiration).toBe(11_000);
  });
});
