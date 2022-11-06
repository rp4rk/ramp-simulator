export type SpellQueue = Spell[];
export type StateSpellReducer = (
  state: SimState,
  spell: Spell | OverTime | Channel,
  tick?: number
) => SimState;
export type Calculated = (state: SimState, spell?: Spell) => number;
export type ChannelCalculated = (state: SimState, spell?: Spell, tick?: number) => number;

export enum SpellCategory {
  Applicator = "Applicator",
  Damage = "Damage",
  Cooldown = "Cooldown",
  Buff = "Buff",
  Tool = "Tool",
  Ignored = "Ignored",
}

export interface Spell {
  category?: SpellCategory;
  uncastable?: boolean;
  id?: number;
  metadata?: string[];
  icon?: string;
  name: string;
  damage?: number | Calculated;
  healing?: number | Calculated;
  absorb?: number | Calculated;
  cost?: number | Calculated;
  castTime?: number | Calculated;
  fixedGcd?: boolean;
  shortGcd?: boolean;
  effect?: StateSpellReducer[];
  offGcd?: boolean;
  cooldown?: number | Calculated;
}

export interface Channel extends Spell {
  ticks: number | Calculated;
  channel: true;
  damage: number | ChannelCalculated | undefined;
}

export interface Stats {
  spellpower: number;
  haste: number;
  mastery: number;
  crit: number;
  vers: number;
}

export interface Player extends Stats {
  statBuffs: { [k in keyof Stats]: StatBuff[] };
}

export interface StatBuff {
  // The stat to incremement
  stat: keyof Stats;
  // The amount to increment by, if using multiplicative 1 = 100%
  amount: number;
  // The type of increment to perform
  type: StatBuffType;
}

/**
 * The type of stat buff we want to apply
 */
export enum StatBuffType {
  // Additive will increase the state by the provided amount, e.g. +5% crit resulting in 5% -> 10%
  ADDITIVE = "ADDITIVE",
  // Rating will add the rating amount, for example 35 will bring 300 haste to 335
  RATING = "RATING",
  // Multiplicative will multiply the final stat % by the amount provided, e.g. 20% results in going from 5% crit to 6%
  MULTIPLICATIVE = "MULTIPLICATIVE",
}

export interface Buff {
  name: string;
  applied?: number | Calculated;
  expires?: number | Calculated;
  duration: number | Calculated;
  consumed?: boolean;
  statBuff?: StatBuff;
}

/**
 * CalculatedBuff will never have expressions to evaluate for temporal info
 */
export interface CalculatedBuff extends Buff {
  applied: number;
  expires: number;
  duration: number;
}

export interface OverTime extends Buff {
  dot: true;
  ticks: number;
  interval: number | Calculated;
  coefficient: number;
  applied: number;
  expires: number;
  duration: number;
}

export interface HoT extends OverTime {
  hot: true;
}

export interface SimState {
  time: number;
  player: Player;
  absorb: number;
  mana: number;
  healing: number;
  damage: number;
  buffs: Map<string, (CalculatedBuff | OverTime | HoT)[]>;
  cooldowns: Map<string, number>;
  talents: Map<number, { talentId: number; points: number }>;
}
