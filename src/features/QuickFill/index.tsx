import { Card } from "components/Card";
import { FC, memo, useCallback, useContext, useEffect, useState } from "react";
import { useKey, useKeys } from "rooks";
import Spells from "lib/spells";
import { QuickFillSearch } from "./QuickFillSearch";
import { Channel, Spell } from "lib/types";
import Fuse from "fuse.js";
import { QuickFillList } from "./QuickFillList";
import { RampSpell, SimulationsContext } from "context/simulations";
import { addSimulationSpells } from "../../context/simulations.actions";
import { v4 } from "uuid";

const SPELL_LIST = new Fuse(
  Object.values(Spells).filter((spell) => !spell.uncastable),
  {
    keys: ["name", "metadata"],
    threshold: 0.2,
  }
);

const toRampSpell = (spell: Channel | Spell): RampSpell => ({
  ...spell,
  guid: v4(),
});

interface QuickFillProps {}

export const QuickFill: FC<QuickFillProps> = memo((props) => {
  const { dispatch } = useContext(SimulationsContext);

  const [search, setSearch] = useState("");
  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState(0);
  const [hasCombinator, setHasCombinator] = useState(false);

  const [results, setResults] = useState<(Spell | Channel)[]>([]);

  /**
   * Detect Shift Combinator
   */
  useKey("ShiftLeft", () => setHasCombinator(true), {
    eventTypes: ["keydown"],
  });
  useKey("ShiftLeft", () => setHasCombinator(false), {
    eventTypes: ["keyup"],
  });

  /**
   * Update results
   */
  useEffect(() => {
    setResults(SPELL_LIST.search(search).map(({ item }) => item));
    setSelected(0);
  }, [search]);

  /**
   * Show prompt
   */
  useKeys(["ControlLeft", "Space"], () => {
    setSearch("");
    setShow(!show);
  });

  /**
   * Key Handlers
   */
  useKey(["ArrowDown"], (e) => {
    e.preventDefault();
    setSelected(Math.min(results.length - 1, selected + 1));
  });
  useKey(["ArrowUp"], (e) => {
    e.preventDefault();
    setSelected(Math.max(0, selected - 1));
  });
  useKey(["Escape"], () => setShow(false));

  /**
   * Handle submission
   */
  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (search === "") return;

      dispatch(
        addSimulationSpells({
          spells: [toRampSpell(results[selected])],
        })
      );

      if (!hasCombinator) {
        setShow(false);
      }
    },
    [search, hasCombinator, dispatch, results, selected]
  );

  if (!show) return null;

  return (
    <div className="fixed z-50 inset-0 bg-gray-500 bg-opacity-75 transition-opacity flex flex-col items-center">
      <Card className="shadow-sm border border-gray-600 mt-20">
        <h4 className="text-gray-700 mb-2">Quick Search</h4>

        <QuickFillSearch onSubmit={onSubmit} onUpdate={setSearch}></QuickFillSearch>
        {results.length > 0 && <QuickFillList selected={selected} spells={results}></QuickFillList>}
      </Card>
    </div>
  );
});
