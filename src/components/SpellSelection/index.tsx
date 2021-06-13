import { DragSpell } from "components/Spell";
import { Spells } from "lib";
import { Spell as SpellType, SpellCategory } from "lib/types";
import { Separator, SelectionContainer, SelectionCategory } from "./styled";

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
      <div>
        <h4>Spell Selection</h4>
      </div>
      <SelectionContainer>
        {Object.entries(SPELL_CATEGORIES).map(([key, spells]) => (
          <>
            <div>
              <h5>{key}</h5>
              <SelectionCategory>
                {spells.map((spell) => (
                  <DragSpell key={spell.id} spell={spell} />
                ))}
              </SelectionCategory>
            </div>
          </>
        ))}
      </SelectionContainer>
    </>
  );
};