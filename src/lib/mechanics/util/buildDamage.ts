import { Calculated, ChannelCalculated } from "../../types";

/**
 * Calculate the damage coefficient of a spell
 */
export const buildDamage =
  (
    coefficient: number,
    buffs: (Calculated | ChannelCalculated)[] = []
  ): Calculated | ChannelCalculated =>
  (state, spell, tick) => {
    const totalBuff = buffs.reduce((acc, buff) => acc * buff(state, spell, tick), 1);
    return totalBuff * coefficient;
  };
