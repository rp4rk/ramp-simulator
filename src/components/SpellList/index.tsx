import React, { useCallback } from "react";
import { SpellListContainer } from "./styled";

import { Spells } from "lib";
import { Spell as SpellType } from "lib/types";
import { DragSpell, SwappableSpell } from "components/Spell";
import { UniqueSpell } from "components/Timeline";

type SpellProps = {
  /**
   * A spell from the quicksim library.
   */
  spells?: (SpellType | UniqueSpell)[];
  swappable?: boolean;
  setSpells?: (spellList: UniqueSpell[]) => void;
};

const EXCLUDED_SPELLS = ["Ascended Eruption"];
const SPELL_LIST_DEFAULTS = Object.values(Spells).filter(
  (spell) => !EXCLUDED_SPELLS.includes(spell.name)
);

const swap = (i: number, j: number, a: any[]) => {
  const newArr = [...a];
  const firstItem = newArr[i];
  newArr[i] = newArr[j];
  newArr[j] = firstItem;

  return newArr;
};

export const SpellList = function ({
  spells = SPELL_LIST_DEFAULTS,
  swappable = false,
  setSpells,
}: SpellProps) {
  const swapSpells = useCallback(
    (i: number, j: number) => {
      if (!setSpells) return;

      setSpells(swap(i, j, spells));
    },
    [spells, setSpells]
  );

  return (
    <SpellListContainer>
      {spells.map((spell, index) =>
        swappable && "timestamp" in spell ? (
          <SwappableSpell
            swapHandler={swapSpells}
            index={index}
            key={`${spell.id}-${spell.timestamp}`}
            id={`${spell.id}-${spell.timestamp}`}
            spell={spell}
          />
        ) : (
          <DragSpell key={spell.id} spell={spell} />
        )
      )}
    </SpellListContainer>
  );
};
