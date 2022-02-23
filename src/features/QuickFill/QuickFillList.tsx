import { SpellIcon } from "components/SpellIcon";
import { ComponentPropsWithoutRef, FC } from "react";
import { Channel, Spell } from "lib/types";

interface QuickFillListProps extends ComponentPropsWithoutRef<"ol"> {
  spells: (Spell | Channel)[];
  selected?: number;
}

export const QuickFillList: FC<QuickFillListProps> = ({ spells, selected, ...rest }) => {
  return (
    <ol className="list-none space-y-2 mt-4" {...rest}>
      {spells.map((spell, idx) => (
        <li
          key={spell.id}
          className={
            idx === selected
              ? `rounded-sm text-sky-700 space-x-4 p-3 border-solid border border-sky-300 bg-gradient-to-b from-sky-100 to-sky-200`
              : "rounded-sm bg-gray-300 border border-gray-300 space-x-4 p-3"
          }
        >
          <SpellIcon
            className="inline-block rounded-sm w-8"
            name={spell.name}
            icon={spell.icon || "trade_engineering"}
          />
          <span>{spell.name}</span>
        </li>
      ))}
    </ol>
  );
};
