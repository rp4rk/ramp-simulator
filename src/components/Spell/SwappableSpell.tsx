import { useRef } from "react";
import { HoverSpellContainer, SpellImage } from "./styled";
import { DropTargetMonitor, useDrag, useDrop, XYCoord } from "react-dnd";
import { ItemTypes } from "types";
import Tippy from "@tippyjs/react";
import { HoverSpellProps, DragItem } from "./index";

export const SwappableSpell = function ({
  spell,
  id,
  index,
  swapHandler,
  deleteHandler,
}: HoverSpellProps) {
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
      if (index === undefined) return;
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

      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
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
      <Tippy placement="bottom" disabled={isDragging} content={spell.name}>
        <SpellImage
          style={{ opacity }}
          draggable="false"
          alt={`${spell.name} Icon`}
          src={`https://render.worldofwarcraft.com/us/icons/56/${spell.icon}.jpg`}
        />
      </Tippy>
    </HoverSpellContainer>
  );
};
