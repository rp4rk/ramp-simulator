import { useDrop } from "react-dnd";
import { ItemTypes } from "types";
import { Spell } from "lib/types";
import { Spells } from "lib";
import { TimelineContainer } from "./styled";
import { SpellList } from "components/SpellList";
import { RampSpell } from "context/simulations";
import { v4 } from "uuid";

type TimelineProps = {
  spells: RampSpell[];
  setSpells: (arg0: RampSpell[]) => void;
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
        const uniqueSpell: RampSpell = {
          ...targetSpell,
          guid: v4(),
        };

        setSpells([...spells, uniqueSpell]);
      },
    }),
    [setSpells, spells]
  );

  return (
    <TimelineContainer ref={drop}>
      <SpellList
        className="bg-gray-300 p-2 rounded drop-shadow-sm"
        swappable={true}
        spells={spells}
        setSpells={setSpells}
      />
    </TimelineContainer>
  );
};
