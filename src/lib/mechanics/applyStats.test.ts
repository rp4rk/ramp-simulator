import { applyStats } from "./applyStats";
import { SimState, Spell, StatBuffType, Buff } from "../types";
import { createPlayer } from "../player";
import { applyAura } from "./aura";
import { advanceTime } from "./time";

const TEST_AURA: Buff = {
  name: "Test Aura",
  applied: (state) => state.time + 1000,
  duration: 1000,
  statBuff: {
    amount: 0.25,
    stat: "haste",
    type: StatBuffType.MULTIPLICATIVE,
  },
};

const TEST_SPELL: Spell = {
  name: "Test Spell",
  castTime: 2000,
  effect: [],
};

const createMockSimState = (overrides: Partial<SimState> = {}): SimState => {
  return {
    absorb: 0,
    healing: 0,
    damage: 0,
    time: 0,
    player: createPlayer(0, 0, 0, 0, 0),
    cooldowns: new Map(),
    buffs: new Map(),
    ...overrides,
  };
};

describe("applyStats", () => {
  beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation(jest.fn());
    jest.spyOn(console, "debug").mockImplementation(jest.fn());
  });

  test("applies a stat buff to a player as expected", () => {
    // given
    const simState = createMockSimState();

    // when
    const s1 = applyAura(simState, TEST_AURA);
    const s2 = applyStats(s1, TEST_SPELL);

    // then
    expect(s1.player.statBuffs.haste).toHaveLength(0);
    expect(s2.player.statBuffs.haste[0]).toBe(TEST_AURA.statBuff);
  });

  test("removes a stat buff from a player when expected", () => {
    // given
    const simState = createMockSimState();

    // when
    const s1 = applyAura(simState, TEST_AURA);
    const s2 = advanceTime(advanceTime(applyStats(s1, TEST_SPELL), TEST_SPELL), TEST_SPELL);
    const s3 = advanceTime(applyStats(s2, TEST_SPELL), TEST_SPELL);

    // then
    expect(s3.player.statBuffs.haste).toHaveLength(0);
  });

  test("will not apply the same buff multiple times within a global", () => {
    // given
    const simState = createMockSimState();

    // when
    const s1 = applyAura(simState, TEST_AURA);
    const s2 = applyAura(s1, TEST_AURA);
    const s3 = applyAura(s2, TEST_AURA);
    const s4 = applyStats(s3, TEST_SPELL);

    // then
    expect(s1.player.statBuffs.haste).toHaveLength(0);
    expect(s2.player.statBuffs.haste).toHaveLength(0);
    expect(s3.player.statBuffs.haste).toHaveLength(0);
    expect(s4.player.statBuffs.haste).toHaveLength(1);
    expect(s4.player.statBuffs.haste[0]).toBe(TEST_AURA.statBuff);
  });
});
