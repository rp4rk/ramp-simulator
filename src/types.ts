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
