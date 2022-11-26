import { createPlayer } from "lib";
import { applyAura } from "lib/mechanics";
import { PowerWordShield } from "lib/spells";
import { SimState } from "lib/types";
import { SimulationConfiguration } from "./simulations";
import { getSerializableConfiguration } from "./simulations.selectors";

// Create a simulation configuration for testing
const createSimulationConfiguration = (
  overrides: Partial<SimulationConfiguration> = {}
): SimulationConfiguration => ({
  rampSpells: [],
  state: {
    damage: 0,
    absorb: 0,
    mana: 0,
    healing: 0,
    player: createPlayer(0, 0, 0, 0, 0),
    time: 0,
    buffs: new Map(),
    cooldowns: new Map(),
    talents: new Map(),
  },
  ...overrides,
});

describe("getSerializableSimulationState", () => {
  test("correctly serializes spells", () => {
    // given
    const simulationConfiguration = createSimulationConfiguration({
      rampSpells: [{ ...PowerWordShield, guid: "test" }],
    });

    // when
    const serializableState = getSerializableConfiguration(simulationConfiguration);

    // then
    expect(serializableState.rampSpells).toEqual([17]);
  });

  test("correctly serializes buffs", () => {
    // given
    const testSimState: SimState = {
      absorb: 0,
      damage: 0,
      mana: 0,
      healing: 0,
      cooldowns: new Map(),
      player: createPlayer(0, 0, 0, 0, 0),
      time: 0,
      talents: new Map(),
      buffs: new Map(),
    };

    applyAura(testSimState, {
      name: "test",
      duration: 1000,
    });

    const simulationConfiguration = createSimulationConfiguration({
      state: testSimState,
    });

    // when
    const serializableState = getSerializableConfiguration(simulationConfiguration);

    // then
    expect(serializableState.simState.buffs).toEqual([
      [
        "test",
        [
          {
            applied: 0,
            name: "test",
            expires: 1000,
            duration: 1000,
            stacks: 1,
          },
        ],
      ],
    ]);
  });

  it("correctly serializes multiple buffs", () => {
    // given
    const testSimState: SimState = {
      absorb: 0,
      damage: 0,
      healing: 0,
      mana: 0,
      cooldowns: new Map(),
      player: createPlayer(0, 0, 0, 0, 0),
      time: 0,
      talents: new Map(),
      buffs: new Map(),
    };

    const atonementTestBuff = {
      name: "Atonement",
      applied: testSimState.time,
      duration: 9000,
      expires: testSimState.time + 9000,
      stacks: 1,
    };
    applyAura(testSimState, atonementTestBuff);
    applyAura(testSimState, atonementTestBuff);

    const simulationConfiguration = createSimulationConfiguration({
      state: testSimState,
    });

    // when
    const serializableState = getSerializableConfiguration(simulationConfiguration);

    // then
    expect(serializableState.simState.buffs).toEqual([
      ["Atonement", [atonementTestBuff, atonementTestBuff]],
    ]);
  });
});
