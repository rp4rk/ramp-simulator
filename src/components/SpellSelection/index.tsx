import CopyToClipboard from "react-copy-to-clipboard";
import { DragSpell } from "components/Spell";
import { Spells } from "lib";
import { Spell as SpellType, SpellCategory } from "lib/types";
import { Button } from "components/Button";
import React from "react";

const RAMP_SEQUENCE = JSON.stringify({
  spellNames: [
    "Purge the Wicked",
    "Purge the Wicked",
    "Shadow Mend",
    "Power Word: Shield",
    "Power Word: Shield",
    "Power Word: Shield",
    "Power Word: Shield",
    "Power Word: Shield",
    "Power Word: Shield",
    "Power Word: Shield",
    "Power Word: Shield",
    "Power Word: Shield",
  ],
});

function set<T>(s: string, o: { [index: string]: T[] }, i: T) {
  if (o[s]) {
    o[s].push(i);
    return o;
  }

  o[s] = [i];
  return o;
}

const SPELL_CATEGORIES = Object.values(Spells).reduce((acc, spell) => {
  if (spell.category === SpellCategory.Ignored) return acc;

  if (spell.category) {
    return set(spell.category, acc, spell);
  }

  return set("Uncategorized", acc, spell);
}, {} as { [index: string]: SpellType[] });

export const SpellSelection = React.memo(function () {
  return (
    <>
      <div className="flex justify-between mb-4">
        <h4 className="text-lg text-gray-600 font-semibold">Spell Selection</h4>
        <CopyToClipboard text={RAMP_SEQUENCE}>
          <Button icon="ClipboardCopyIcon">Copy Ramp Sequence</Button>
        </CopyToClipboard>
      </div>
      <div className="flex justify-center space-x-2 ">
        {Object.entries(SPELL_CATEGORIES).map(([key, spells]) => (
          <div key={key}>
            <h5 className="text-md text-gray-600 font-semibold">{key}</h5>
            <div className="bg-gradient-to-b from-gray-100 to-gray-200 p-2 rounded drop-shadow-sm">
              {spells.map((spell) => (
                <DragSpell key={spell.id} spell={spell} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
});
