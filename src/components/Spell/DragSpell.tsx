import { HoverSpellContainer, SpellImage } from "./styled";
import { useDrag } from "react-dnd";
import { ItemTypes } from "types";
import Tippy from "@tippyjs/react";
import { HoverSpellProps } from "./index";

export const DragSpell = function ({ spell }: HoverSpellProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.Spell,
    item: { id: spell.name },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  const opacity = isDragging ? 0.6 : 1;
  return (
    <HoverSpellContainer style={{ opacity }} ref={drag}>
      <Tippy placement="bottom" disabled={isDragging} content={spell.name}>
        <SpellImage
          draggable="false"
          alt={`${spell.name} Icon`}
          src={`https://render.worldofwarcraft.com/us/icons/56/${spell.icon}.jpg`}
        />
      </Tippy>
    </HoverSpellContainer>
  );
};
