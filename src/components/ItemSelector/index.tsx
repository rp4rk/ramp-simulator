import { Items } from "lib";
import { Item, ItemType } from "lib/types";
import { Spell } from "components/Spell";
import { FC, useCallback } from "react";

const LEGENDARIES = Object.values(Items).filter((item: Item) => item.type === ItemType.Legendary);
const CONDUITS = Object.values(Items).filter((item: Item) => item.type === ItemType.Conduit);
const TIERS = Object.values(Items).filter((item: Item) => item.type === ItemType.Item);
const TALENTS = Object.values(Items).filter((item: Item) => item.type === ItemType.Talent);

type ItemSelectorProps = {
  items: Item[];
  onItemAdd: (items: Item[]) => void;
  onItemRemove: (items: Item[]) => void;
};

export const ItemSelector: FC<ItemSelectorProps> = ({ items, onItemAdd, onItemRemove }) => {
  const toggleItems = useCallback(
    (item) => {
      const itemToggled = items.find((i) => i.id === item.id);
      if (itemToggled) {
        onItemRemove([item]);
      } else {
        onItemAdd([item]);
      }
    },
    [onItemAdd, onItemRemove, items]
  );

  const itemExists = (items: Item[], id: number): boolean => !!items.find((i) => i.id === id);

  return (
    <div className="flex sm:block sm:flex-wrap sm:space-between">
      <div className="sm:grow">
        <h4 className="text-lg text-gray-600 font-semibold">Legendaries</h4>
        {LEGENDARIES.map((legendary) => (
          <Spell
            key={legendary.id}
            spell={legendary}
            onClick={(spell) => toggleItems(spell)}
            toggled={itemExists(items, legendary.id)}
          />
        ))}
      </div>
      <div className="sm:grow">
        <h4 className="text-lg text-gray-600 font-semibold">Conduits</h4>
        {CONDUITS.map((conduit) => (
          <Spell
            key={conduit.id}
            spell={conduit}
            onClick={(spell) => toggleItems(spell)}
            toggled={itemExists(items, conduit.id)}
          />
        ))}
      </div>
      <div className="sm:grow">
        <h4 className="text-lg text-gray-600 font-semibold">Items</h4>
        {TIERS.map((tier) => (
          <Spell
            key={tier.id}
            spell={tier}
            onClick={(spell) => toggleItems(spell)}
            toggled={itemExists(items, tier.id)}
          />
        ))}
      </div>
      <div className="sm:grow">
        <h4 className="text-lg text-gray-600 font-semibold">Talents</h4>
        {TALENTS.map((tier) => (
          <Spell
            key={tier.id}
            spell={tier}
            onClick={(spell) => toggleItems(spell)}
            toggled={itemExists(items, tier.id)}
          />
        ))}
      </div>
    </div>
  );
};
