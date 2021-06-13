import React, { useEffect, useState } from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "ItemTypes";
import { Spell } from "lib/types";
import { Spells } from "lib";
import { TimelineContainer } from "./styled";
import { SpellList } from "components/SpellList";

type TimelineProps = {
  onChange?: (arg0: Spell[]) => any;
};

const SpellMap: { [key: string]: Spell } = Object.values(Spells).reduce(
  (acc, curr) => {
    acc[curr.name] = curr;
    return acc;
  },
  {} as { [key: string]: Spell }
);

export interface UniqueSpell extends Spell {
  timestamp: number;
}

export const Timeline = function ({ onChange }: TimelineProps) {
  const [spells, setSpells] = useState<UniqueSpell[]>([]);

  // Drag n' Drop
  const [, drop] = useDrop(
    () => ({
      accept: ItemTypes.Spell,
      drop: (a: any) => {
        const targetSpell = SpellMap[a.id];
        const uniqueSpell: UniqueSpell = {
          ...targetSpell,
          timestamp: new Date().getTime(),
        };

        setSpells([...spells, uniqueSpell]);
      },
    }),
    [setSpells, spells]
  );

  // Relay changes
  useEffect(() => {
    if (!onChange) return;

    onChange(spells);
  }, [spells, onChange]);

  return (
    <TimelineContainer ref={drop}>
      <SpellList swappable={true} spells={spells} setSpells={setSpells} />
    </TimelineContainer>
  );
};
