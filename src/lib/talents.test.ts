import { getTalent, hasTalent, getTalentPoints } from "./talents";

import { createPlayer } from "./player";
import { SimState } from "./types";

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
    talents: new Map([
      [1, { talentId: 1, points: 1 }],
      [2, { talentId: 2, points: 2 }],
      [3, { talentId: 3, points: 3 }],
    ]),
    ...overrides,
  };
};

describe("talent utils", () => {
  describe("getTalent", () => {
    it("should return the talent entry", () => {
      // given
      const sut = createMockSimState();

      // when
      const result = getTalent(sut, 1);

      // then
      expect(result).toEqual({ talentId: 1, points: 1 });
    });
  });

  describe("hasTalent", () => {
    it("should return true if the talent exists", () => {
      // given
      const sut = createMockSimState();

      // when
      const result = hasTalent(sut, 1);

      // then
      expect(result).toBe(true);
    });

    it("should return false if the talent does not exist", () => {
      // given
      const sut = createMockSimState();

      // when
      const result = hasTalent(sut, 4);

      // then
      expect(result).toBe(false);
    });
  });

  describe("getTalentPoints", () => {
    it("should return the number of points in the talent", () => {
      // given
      const sut = createMockSimState();

      // when
      const result = getTalentPoints(sut, 1);

      // then
      expect(result).toBe(1);
    });
  });
});
