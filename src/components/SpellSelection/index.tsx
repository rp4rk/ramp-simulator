import CopyToClipboard from "react-copy-to-clipboard";
import { DragSpell } from "components/Spell";
import { Spells } from "lib";
import { Spell as SpellType, SpellCategory } from "lib/types";

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

export const SpellSelection = function () {
  return (
    <>
      <div className="flex justify-between mb-4">
        <h4 className="text-lg text-gray-600 font-semibold">Spell Selection</h4>
        <CopyToClipboard text={RAMP_SEQUENCE}>
          <button className="text-sm text-white font-semibold py-2 px-4 bg-sky-600 hover:bg-sky-700 rounded-full">
            Copy Ramp Sequence
          </button>
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
};
