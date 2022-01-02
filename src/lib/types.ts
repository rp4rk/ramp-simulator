export type SpellQueue = Spell[];
export type StateSpellReducer = (state: SimState, spell: Spell | OverTime | Channel) => SimState;
type Calculated = (state: SimState) => number;

export enum ItemType {
  Legendary = "Legendary",
  Conduit = "Conduit",
  Tier = "Tier",
}

export interface Item extends Buff {
  id: number;
  icon: string;
  type: ItemType;
  expires: number;
  duration: number;
}

export enum SpellCategory {
  Applicator = "Applicator",
  Damage = "Damage",
  Cooldown = "Cooldown",
  Kyrian = "Kyrian",
  Venthyr = "Venthyr",
  Necrolord = "Necrolord",
  Ignored = "Ignored",
}

export interface Spell {
  category?: SpellCategory;
  id?: number;
  icon?: string;
  name: string;
  damage?: number | Calculated;
  healing?: number | Calculated;
  absorb?: number | Calculated;
  castTime?: number;
  fixedGcd?: boolean;
  shortGcd?: boolean;
  effect?: StateSpellReducer[];
  offGcd?: boolean;
  cooldown?: number | Calculated;
}

export interface Channel extends Spell {
  ticks: number | Calculated;
  channel: true;
}

export interface Player {
  spellpower: number;
  haste: number;
  mastery: number;
  crit: number;
  vers: number;
}

export interface Buff {
  name: string;
  applied: number;
  expires?: number | Calculated;
  duration: number | Calculated;
  consumed?: boolean;
}

/**
 * CalculatedBuff will never have expressions to evaluate for temporal info
 */
export interface CalculatedBuff extends Buff {
  expires: number;
  duration: number;
}

export interface OverTime extends Buff {
  dot: true;
  ticks: number;
  interval: number | Calculated;
  coefficient: number;
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
  healing: number;
  damage: number;
  buffs: Map<string, (CalculatedBuff | OverTime | HoT)[]>;
  cooldowns: Map<string, number>;
}
