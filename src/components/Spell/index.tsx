import { useRef } from "react";
import { Item, Spell as SpellType } from "lib/types";
import { HoverSpellContainer, SpellImage, SpellContainer } from "./styled";
import { DropTargetMonitor, useDrag, useDrop, XYCoord } from "react-dnd";
import { ItemTypes } from "types";

export type SpellProps = {
  spell: SpellType | Item;
  onClick: (arg0: SpellType | Item) => void;
  toggled?: boolean;
};

export const Spell = function ({ spell, onClick, toggled }: SpellProps) {
  return (
    <SpellContainer toggled={toggled} onClick={() => onClick(spell)}>
      <SpellImage
        draggable="false"
        alt={`${spell.name} Icon`}
        src={`https://render.worldofwarcraft.com/us/icons/56/${spell.icon}.jpg`}
      />
    </SpellContainer>
  );
};

type HoverSpellProps = {
  /**
   * A spell from the quicksim library.
   */
  spell: SpellType | Item;
  id?: string;
  index?: number;
  swapHandler?: (i: number, j: number) => void;
  deleteHandler?: (idx: number) => void;
};

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
      <SpellImage
        draggable="false"
        alt={`${spell.name} Icon`}
        src={`https://render.worldofwarcraft.com/us/icons/56/${spell.icon}.jpg`}
      />
    </HoverSpellContainer>
  );
};

interface DragItem {
  index: number;
  id: string;
  type: string;
}

export const SwappableSpell = function ({ spell, id, index, swapHandler, deleteHandler }: HoverSpellProps) {
  const ref = useRef<HTMLDivElement>(null);

  /**
   * Drop logic
   */
  const [{ handlerId }, drop] = useDrop({
    accept: ItemTypes.SpellRearrange,
    collect(monitor: DropTargetMonitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor: DropTargetMonitor) {
      if (!index) return;
      if (!ref.current) return;
      if (typeof swapHandler !== "function") return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      // Determine space on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      const clientOffset = monitor.getClientOffset();
      const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
      const hoverClientX = (clientOffset as XYCoord).x - hoverBoundingRect.left;

      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
        return;
      }
      if (dragIndex < hoverIndex && hoverMiddleY < hoverClientY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverMiddleY > hoverClientY) {
        return;
      }

      swapHandler(dragIndex, hoverIndex);

      item.index = hoverIndex;
    },
  });

  /**
   * Drag logic
   */
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.SpellRearrange,
    item: () => {
      return { id, index };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      const didDrop = monitor.didDrop();

      if (!didDrop) {
        if (typeof item.index !== "number") return;
        if (!deleteHandler) return;

        deleteHandler(item.index);
      }
    },
  });

  const opacity = isDragging ? 0.1 : 1;
  drag(drop(ref));

  return (
    <HoverSpellContainer ref={ref} data-handler-id={handlerId}>
      <SpellImage
        style={{ opacity }}
        draggable="false"
        alt={`${spell.name} Icon`}
        src={`https://render.worldofwarcraft.com/us/icons/56/${spell.icon}.jpg`}
      />
    </HoverSpellContainer>
  );
};
