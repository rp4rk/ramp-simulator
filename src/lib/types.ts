export type SpellQueue = Spell[];
export type StateSpellReducer = (
  state: SimState,
  spell: Spell | DoT
) => SimState;
type Calculated = (state: SimState) => number;

export enum ItemType {
  Legendary,
  Conduit,
  Tier,
}

export interface Item extends Buff {
  id: number;
  icon: string;
  type: ItemType;
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
  expires: number;
  duration: number;
  consumed?: boolean;
}

export interface DoT extends Buff {
  ticks: number;
  interval: number | Calculated;
  damage: number;
}

export interface SimState {
  time: number;
  player: Player;
  absorb: number;
  healing: number;
  damage: number;
  buffs: Map<string, (Buff | DoT)[]>;
  cooldowns: Map<string, number>;
}
