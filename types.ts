export type SpellQueue = Spell[];
export type StateSpellReducer = (state: SimState, spell: Spell) => SimState;
type Calculated = (state: SimState) => number;

export interface Spell {
  name: string;
  damage?: number | Calculated;
  healing?: number | Calculated;
  absorb?: number | Calculated;
  castTime?: number;
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
  interval: number;
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
