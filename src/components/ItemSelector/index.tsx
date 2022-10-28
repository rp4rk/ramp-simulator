// import { Items } from "lib";
import { Item } from "lib/types";
// import { Spell } from "components/Spell";
import { FC } from "react";

type ItemSelectorProps = {
  items: Item[];
  onItemAdd: (items: Item[]) => void;
  onItemRemove: (items: Item[]) => void;
};

export const ItemSelector: FC<ItemSelectorProps> = ({ items, onItemAdd, onItemRemove }) => {
  // const toggleItems = useCallback(
  //   (item) => {
  //     const itemToggled = items.find((i) => i.id === item.id);
  //     if (itemToggled) {
  //       onItemRemove([item]);
  //     } else {
  //       onItemAdd([item]);
  //     }
  //   },
  //   [onItemAdd, onItemRemove, items]
  // );

  // const itemExists = (items: Item[], id: number): boolean => !!items.find((i) => i.id === id);

  return (
    <div className="flex sm:block sm:flex-wrap sm:space-between">
      <div className="sm:grow">
        {/* <h4 className="text-lg text-gray-600 font-semibold">Legendaries</h4> */}
      </div>
    </div>
  );
};
