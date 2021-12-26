export type SpellQueue = Spell[];
export type StateSpellReducer = (state: SimState, spell: Spell | DoT) => SimState;
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

export interface DoT extends Buff {
  ticks: number;
  interval: number | Calculated;
  damage: number;
  expires: number;
  duration: number;
}

export interface SimState {
  time: number;
  player: Player;
  absorb: number;
  healing: number;
  damage: number;
  buffs: Map<string, (CalculatedBuff | DoT)[]>;
  cooldowns: Map<string, number>;
}
