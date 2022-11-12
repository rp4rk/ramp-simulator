import { createMockSimState } from "test.utils";
import * as buffs from "./buff";
import { CalculatedBuff, OverTime } from "./types";

const createMockBuff = (overrides: Partial<CalculatedBuff> = {}): CalculatedBuff => ({
  applied: 0,
  duration: 0,
  expires: 0,
  stacks: 0,
  name: "test aura",
  ...overrides,
});

const createMockDoT = (overrides: Partial<OverTime> = {}): OverTime => ({
  dot: true,
  applied: 0,
  coefficient: 0,
  duration: 0,
  expires: 0,
  stacks: 0,
  interval: 0,
  name: "test dot",
  ticks: 0,
  ...overrides,
});

describe("buffs", () => {
  describe("getAura", () => {
    it("returns the most recent aura", () => {
      const state = createMockSimState({
        buffs: new Map([
          [
            "test aura",
            [
              createMockBuff({ applied: 0, expires: 100 }),
              createMockBuff({ applied: 100, expires: 200 }),
              createMockBuff({ applied: 200, expires: 300 }),
            ],
          ],
        ]),
      });

      state.time = 250;

      expect(buffs.getAura(state, "test aura")).toEqual(
        createMockBuff({ applied: 200, expires: 300 })
      );
    });

    it("returns undefined if no aura is found", () => {
      const state = createMockSimState({
        buffs: new Map(),
      });

      expect(buffs.getAura(state, "test aura")).toEqual(undefined);
    });

    it("will not return a consumed aura", () => {
      const state = createMockSimState({
        buffs: new Map([
          ["test aura", [createMockBuff({ applied: 200, expires: 300, consumed: true })]],
        ]),
      });

      state.time = 150;
      buffs.consumeAura("test aura")(state);

      expect(buffs.getAura(state, "test aura")).toEqual(undefined);
    });
  });

  describe("consumeAura", () => {
    it("consumes the most recent aura", () => {
      const state = createMockSimState({
        buffs: new Map([
          [
            "test aura",
            [
              createMockBuff({ applied: 0, expires: 100 }),
              createMockBuff({ applied: 100, expires: 200 }),
              createMockBuff({ applied: 200, expires: 300 }),
            ],
          ],
        ]),
      });

      state.time = 250;

      buffs.consumeAura("test aura")(state);

      expect(state.buffs.get("test aura")?.at(-1)?.consumed).toEqual(true);
    });
  });

  describe("hasAura", () => {
    test("should return true if an aura exists inside the simulation state", () => {
      // given
      const sut = createMockSimState({
        buffs: new Map([
          [
            "test aura",
            [
              createMockBuff({
                applied: 0,
                duration: 10_000,
                expires: 10_000,
                name: "test aura",
              }),
            ],
          ],
        ]),
        time: 1000,
      });

      // when
      const hasTestAura = buffs.hasAura(sut, "test aura");

      // then
      expect(hasTestAura).toBe(true);
    });

    test("should return false if an aura does not exist inside the simulation state", () => {
      // given
      const sut = createMockSimState({
        time: 1000,
      });

      // when
      const hasTestAura = buffs.hasAura(sut, "test aura");

      // then
      expect(hasTestAura).toBe(false);
    });

    test("should return false if a matching aura has expired", () => {
      // given
      const sut = createMockSimState({
        buffs: new Map([
          [
            "test aura",
            [
              {
                applied: 0,
                duration: 10_000,
                expires: 10_000,
                name: "test aura",
              } as CalculatedBuff,
            ],
          ],
        ]),
        time: 12_000,
      });

      // when
      const hasTestAura = buffs.hasAura(sut, "test aura");

      // then
      expect(hasTestAura).toBe(false);
    });

    test("should return false if the buff has not been applied yet", () => {
      // given
      const sut = createMockSimState({
        buffs: new Map([
          [
            "test aura",
            [
              {
                applied: 5000,
                duration: 10_000,
                expires: 10_000,
                name: "test aura",
              } as CalculatedBuff,
            ],
          ],
        ]),
        time: 1000,
      });

      // when
      const hasTestAura = buffs.hasAura(sut, "test aura");

      // then
      expect(hasTestAura).toBe(false);
    });
  });

  describe("numBuffsActive", () => {
    test("should return an accurate count for the number of buffs active", () => {
      // given
      const sut = createMockSimState({
        buffs: new Map([
          [
            "test aura",
            [
              createMockBuff({
                applied: 0,
                duration: 10_000,
                expires: 10_000,
                name: "test aura",
              }),
              createMockBuff({
                applied: 0,
                duration: 10_000,
                expires: 10_000,
                name: "test aura",
              }),
            ],
          ],
        ]),
        time: 1000,
      });

      // when
      const numActiveBuffs = buffs.numBuffsActive(sut, "test aura");

      // then
      expect(numActiveBuffs).toBe(2);
    });

    test("should ignore expired buffs", () => {
      // given
      const sut = createMockSimState({
        buffs: new Map([
          [
            "test aura",
            [
              createMockBuff({
                applied: 0,
                duration: 4000,
                expires: 4000,
                name: "test aura",
              }),
              createMockBuff({
                applied: 0,
                duration: 10_000,
                expires: 10_000,
                name: "test aura",
              }),
            ],
          ],
        ]),
        time: 5000,
      });

      // when
      const numActiveBuffs = buffs.numBuffsActive(sut, "test aura");

      // then
      expect(numActiveBuffs).toBe(1);
    });

    test("should ignore buffs which have not been applied yet", () => {
      // given
      const sut = createMockSimState({
        buffs: new Map([
          [
            "test aura",
            [
              createMockBuff({
                applied: 6000,
                duration: 4000,
                expires: 9000,
                name: "test aura",
              }),
              createMockBuff({
                applied: 0,
                duration: 10_000,
                expires: 10_000,
                name: "test aura",
              }),
            ],
          ],
        ]),
        time: 5000,
      });

      // when
      const numActiveBuffs = buffs.numBuffsActive(sut, "test aura");

      // then
      expect(numActiveBuffs).toBe(1);
    });
  });

  describe("getActiveBuffs", () => {
    test("should return the active buffs", () => {
      // given
      const sut = createMockSimState({
        buffs: new Map([
          [
            "test aura",
            [
              createMockBuff({
                applied: 0,
                duration: 10_000,
                expires: 10_000,
                name: "test aura",
              }),
              createMockBuff({
                applied: 0,
                duration: 10_000,
                expires: 10_000,
                name: "test aura",
              }),
            ],
          ],
        ]),
        time: 1000,
      });

      // when
      const activeBuffs = buffs.getActiveBuffs(sut, "test aura");

      // then
      expect(activeBuffs).toEqual([
        createMockBuff({
          applied: 0,
          duration: 10_000,
          expires: 10_000,
          name: "test aura",
        }),
        createMockBuff({
          applied: 0,
          duration: 10_000,
          expires: 10_000,
          name: "test aura",
        }),
      ]);
    });

    test("should not return expired buffs", () => {
      // given
      const sut = createMockSimState({
        buffs: new Map([
          [
            "test aura",
            [
              createMockBuff({
                applied: 0,
                duration: 4000,
                expires: 4000,
                name: "test aura",
              }),
              createMockBuff({
                applied: 0,
                duration: 10_000,
                expires: 10_000,
                name: "test aura",
              }),
            ],
          ],
        ]),
        time: 5000,
      });

      // when
      const activeBuffs = buffs.getActiveBuffs(sut, "test aura");

      // then
      expect(activeBuffs).toEqual([
        createMockBuff({
          applied: 0,
          duration: 10_000,
          expires: 10_000,
          name: "test aura",
        }),
      ]);
    });

    test("should ignore buffs which have not been applied yet", () => {
      // given
      const sut = createMockSimState({
        buffs: new Map([
          [
            "test aura",
            [
              createMockBuff({
                applied: 6000,
                duration: 4000,
                expires: 9000,
                name: "test aura",
              }),
              createMockBuff({
                applied: 0,
                duration: 10_000,
                expires: 10_000,
                name: "test aura",
              }),
            ],
          ],
        ]),
        time: 5000,
      });

      // when
      const activeBuffs = buffs.getActiveBuffs(sut, "test aura");

      // then
      expect(activeBuffs).toEqual([
        createMockBuff({
          applied: 0,
          duration: 10_000,
          expires: 10_000,
          name: "test aura",
        }),
      ]);
    });
  });

  describe("getActiveDoTs", () => {
    test("should return active DoTs", () => {
      // given
      const sut = createMockSimState({
        buffs: new Map([
          [
            "test aura",
            [
              createMockDoT({
                applied: 0,
                duration: 10_000,
                expires: 10_000,
              }),
              createMockDoT({
                applied: 0,
                duration: 10_000,
                expires: 10_000,
              }),
            ],
          ],
        ]),
        time: 1000,
      });

      // when
      const activeDoTs = buffs.getActiveDoTs(sut);

      // then
      expect(activeDoTs).toEqual([
        createMockDoT({
          applied: 0,
          duration: 10_000,
          expires: 10_000,
        }),
        createMockDoT({
          applied: 0,
          duration: 10_000,
          expires: 10_000,
        }),
      ]);
    });

    test("should not return expired DoTs", () => {
      // given
      const sut = createMockSimState({
        buffs: new Map([
          [
            "test aura",
            [
              createMockDoT({
                applied: 0,
                duration: 3000,
                expires: 3000,
              }),
              createMockDoT({
                applied: 0,
                duration: 10_000,
                expires: 10_000,
              }),
            ],
          ],
        ]),
        time: 5000,
      });

      // when
      const activeDoTs = buffs.getActiveDoTs(sut);

      // then
      expect(activeDoTs).toEqual([
        createMockDoT({
          applied: 0,
          duration: 10_000,
          expires: 10_000,
        }),
      ]);
    });
  });
});
