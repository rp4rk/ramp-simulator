import { useDrop } from "react-dnd";
import { ItemTypes } from "ItemTypes";
import { Spell } from "lib/types";
import { Spells } from "lib";
import { TimelineContainer } from "./styled";
import { SpellList } from "components/SpellList";
import { UniqueSpell } from "components/SimOrchestrator";

type TimelineProps = {
  spells: UniqueSpell[];
  setSpells: (arg0: UniqueSpell[]) => void;
};

const SpellMap: { [key: string]: Spell } = Object.values(Spells).reduce((acc, curr) => {
  acc[curr.name] = curr;
  return acc;
}, {} as { [key: string]: Spell });

export const Timeline = function ({ spells, setSpells }: TimelineProps) {
  // Drag n' Drop
  const [, drop] = useDrop(
    () => ({
      accept: ItemTypes.Spell,
      drop: (a: any) => {
        const targetSpell = SpellMap[a.id];
        const uniqueSpell: UniqueSpell = {
          ...targetSpell,
          identifier: new Date().getTime(),
        };

        setSpells([...spells, uniqueSpell]);
      },
    }),
    [setSpells, spells]
  );

  return (
    <TimelineContainer ref={drop}>
      <SpellList
        className="bg-gray-100 p-2 rounded drop-shadow-sm"
        swappable={true}
        spells={spells}
        setSpells={setSpells}
      />
    </TimelineContainer>
  );
};
