import { Spell as SpellType } from "lib/types";
import { SpellImage, SpellContainer } from "./styled";
import Tippy from "@tippyjs/react";

export type SpellProps = {
  spell: SpellType;
  onClick: (arg0: SpellType) => void;
  toggled?: boolean;
};

export const Spell = function ({ spell, onClick, toggled }: SpellProps) {
  return (
    <SpellContainer toggled={toggled} onClick={() => onClick(spell)}>
      <Tippy placement="bottom" content={spell.name}>
        <SpellImage
          draggable="false"
          alt={`${spell.name} Icon`}
          src={`https://render.worldofwarcraft.com/us/icons/56/${spell.icon}.jpg`}
        />
      </Tippy>
    </SpellContainer>
  );
};

export type HoverSpellProps = {
  /**
   * A spell from the quicksim library.
   */
  spell: SpellType;
  id?: string;
  index?: number;
  swapHandler?: (i: number, j: number) => void;
  deleteHandler?: (idx: number) => void;
  onClick?: (spell: SpellType) => void;
};

export interface DragItem {
  index: number;
  id: string;
  type: string;
}
