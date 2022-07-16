import { useCallback } from "react";
import { SpellListContainer } from "./styled";

import Spells from "lib/spells";
import { Spell as SpellType } from "lib/types";
import { DragSpell, SwappableSpell } from "components/Spell";
import { RampSpell } from "context/simulations";

type SpellProps = {
  /**
   * A spell from the quicksim library.
   */
  spells?: (SpellType | RampSpell)[];
  swappable?: boolean;
  setSpells?: (spellList: RampSpell[]) => void;
  deleteSpell?: (idx: number) => void;
  className?: string;
};

const EXCLUDED_SPELLS = ["Ascended Eruption"];
const SPELL_LIST_DEFAULTS = Object.values(Spells).filter(
  (spell) => !EXCLUDED_SPELLS.includes(spell.name)
);

const swap = (i: number, j: number, a: any[]) => {
  const swappingItem = a[i];
  const [first, second] = a.reduce(
    (acc, curr, idx) => {
      if (idx === i) return acc;

      if (i > j) {
        if (idx < j) {
          acc[0].push(curr);
          return acc;
        }
      }
      if (i < j) {
        if (idx <= j) {
          acc[0].push(curr);
          return acc;
        }
      }

      acc[1].push(curr);
      return acc;
    },
    [[], []]
  );

  return [...first, swappingItem, ...second];
};

export const SpellList = function ({
  spells = SPELL_LIST_DEFAULTS,
  swappable = false,
  setSpells,
  className = "",
}: SpellProps) {
  const swapSpells = useCallback(
    (i: number, j: number) => {
      if (!setSpells) return;

      setSpells(swap(i, j, spells));
    },
    [spells, setSpells]
  );

  const deleteSpell = useCallback(
    (idx: number) => {
      if (!setSpells) return;
      setSpells(spells.filter((_, j) => idx !== j) as any[]);
    },
    [spells, setSpells]
  );

  return (
    <SpellListContainer className={"".concat(className)}>
      {spells.map((spell, index) =>
        swappable && "guid" in spell ? (
          <SwappableSpell
            swapHandler={swapSpells}
            index={index}
            key={`${spell.id}-${spell.guid}`}
            id={`${spell.id}-${spell.guid}`}
            spell={spell}
            deleteHandler={deleteSpell}
          />
        ) : (
          <DragSpell key={spell.id} spell={spell} />
        )
      )}
    </SpellListContainer>
  );
};
