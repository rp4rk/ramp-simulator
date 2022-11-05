import { createMockSimState } from "test.utils";
import { calculateSinsDamageBonus } from "./SinsOfTheMany";
import { applyAtonement } from "./Atonement";
import { SimState } from "lib/types";

describe("calculateSinsDamageBonus", () => {
  it("should return 30 when no atonements are active", () => {
    const state = createMockSimState();

    expect(calculateSinsDamageBonus(state)).toBe(1.3);
  });

  it("should return 30 when 5 atonements are active", () => {
    const state = createMockSimState();
    const newState = Array.from({ length: 5 }).reduce<SimState>(
      (newState) => applyAtonement(newState),
      state
    );

    expect(calculateSinsDamageBonus(newState)).toBe(1.3);
  });

  it("should return 18% when 8 atonements are active", () => {
    const state = createMockSimState();
    const newState = Array.from({ length: 8 }).reduce<SimState>(
      (newState) => applyAtonement(newState),
      state
    );

    expect(calculateSinsDamageBonus(newState)).toBe(1.18);
  });

  it("should return 9% when 11 atonements are active", () => {
    const state = createMockSimState();
    const newState = Array.from({ length: 11 }).reduce<SimState>(
      (newState) => applyAtonement(newState),
      state
    );

    expect(calculateSinsDamageBonus(newState)).toBe(1.09);
  });

  it("should return 5% when 13 atonements are active", () => {
    const state = createMockSimState();
    const newState = Array.from({ length: 13 }).reduce<SimState>(
      (newState) => applyAtonement(newState),
      state
    );

    expect(calculateSinsDamageBonus(newState)).toBe(1.05);
  });

  it("should return 3% when 15 atonements are active", () => {
    const state = createMockSimState();
    const newState = Array.from({ length: 15 }).reduce<SimState>(
      (newState) => applyAtonement(newState),
      state
    );

    expect(calculateSinsDamageBonus(newState)).toBe(1.03);
  });

  it("should reuturn 1.5% when 18 atonements are active", () => {
    const state = createMockSimState();
    const newState = Array.from({ length: 18 }).reduce<SimState>(
      (newState) => applyAtonement(newState),
      state
    );

    expect(calculateSinsDamageBonus(newState)).toBe(1.015);
  });

  it("should return 1% when 20 atonements are active", () => {
    const state = createMockSimState();
    const newState = Array.from({ length: 20 }).reduce<SimState>(
      (newState) => applyAtonement(newState),
      state
    );

    expect(calculateSinsDamageBonus(newState)).toBe(1.01);
  });
});
