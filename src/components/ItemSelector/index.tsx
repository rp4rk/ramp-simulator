import { Items } from "lib";
import { Item, ItemType, Spell as SpellType } from "lib/types";
import { Spell } from "components/Spell";
import { useCallback, useEffect, useState } from "react";

const LEGENDARIES = Object.values(Items).filter(
  (item: Item) => item.type === ItemType.Legendary
);
const CONDUITS = Object.values(Items).filter(
  (item: Item) => item.type === ItemType.Conduit
);

type ItemSelectorProps = {
  onChange?: (arg0: Item[]) => void;
};

export const ItemSelector = function ItemSelector({
  onChange,
}: ItemSelectorProps) {
  const [selectedItems, setSelectedItems] = useState<{
    [key: string]: Item;
  }>({
    [Items.ClarityOfMind.name]: Items.ClarityOfMind,
    [Items.Exaltation.name]: Items.Exaltation,
    [Items.RabidShadows.name]: Items.RabidShadows,
    [Items.CourageousAscension.name]: Items.CourageousAscension,
  });

  /**
   * Toggle Item Callback
   */
  const toggleItems = useCallback(
    (item: Item | SpellType) => {
      if (!("type" in item)) return;
      if (!selectedItems[item.name]) {
        setSelectedItems({ ...selectedItems, [item.name]: item });
        return;
      }

      const newSelectedItems = { ...selectedItems };
      delete newSelectedItems[item.name];
      setSelectedItems(newSelectedItems);
    },
    [selectedItems, setSelectedItems]
  );

  /**
   * onChange
   */
  useEffect(() => {
    if (!onChange) return;

    onChange(Object.values(selectedItems));
  }, [selectedItems, onChange]);

  return (
    <div>
      <div>
        <h4>Legendaries</h4>
        {LEGENDARIES.map((legendary) => (
          <Spell
            key={legendary.name}
            spell={legendary}
            onClick={(spell) => toggleItems(spell)}
            toggled={!!selectedItems[legendary.name]}
          />
        ))}
      </div>
      <div>
        <h4>Conduits</h4>
        {CONDUITS.map((conduit) => (
          <Spell
            key={conduit.name}
            spell={conduit}
            onClick={(spell) => toggleItems(spell)}
            toggled={!!selectedItems[conduit.name]}
          />
        ))}
      </div>
    </div>
  );
};
