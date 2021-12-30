export enum ItemTypes {
  Spell = "spell",
  SpellRearrange = "spell_rearrange",
}

// Flux Standard Action
export type Action = {
  type: string;
  error?: Error;
  payload?: any;
  meta?: any;
};

// Determines if the provided type can be serialized
export type Serializable<T> = T extends string | number | boolean | null
  ? T
  : T extends Function
  ? never
  : T extends Map<infer K, infer V>
  ? [K, Serializable<V>][]
  : T extends object
  ? { [K in keyof T]: Serializable<T[K]> }
  : never;

export interface hasId {
  id: number;
}
