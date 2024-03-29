// import CopyToClipboard from "react-copy-to-clipboard";
import { DragSpell } from "components/Spell/DragSpell";
import { Spells } from "lib";
import { Spell as SpellType, SpellCategory } from "lib/types";
import { Button } from "components/Button";
import React, { useCallback, useContext } from "react";
import { SimulationsContext } from "context/simulations";
import { isSerializedSimulationState } from "context/simulations.selectors";
import clipboard from "clipboardy";
import lzbase62 from "lzbase62";
import { addSimulationSpells, importSimulation } from "context/simulations.actions";
import { toRampSpell } from "features/QuickFill";
import { Toast } from "components/Toast";
import { useState } from "react";

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
  const { dispatch } = useContext(SimulationsContext);
  const [showToast, setShowToast] = useState(false);

  const importString = useCallback(async () => {
    const clipboardValue = await clipboard.read();
    const [header, data] = clipboardValue.split("-");

    if (header !== "ramp") {
      alert("Invalid ramp string.");
      return;
    }

    const value = lzbase62.decompress(data);
    const parsedValue = JSON.parse(value);

    // Type check to ensure this meets the schema of a serialized simulation state
    if (!isSerializedSimulationState(parsedValue)) {
      return;
    }

    setShowToast(true);

    dispatch(
      importSimulation({
        simulation: parsedValue,
      })
    );
  }, [dispatch]);

  return (
    <>
      <div className="flex justify-between mb-4">
        <h4 className="text-lg text-gray-600 font-semibold font-sans">Spell Selection</h4>
        <div className="space-x-2">
          <Button outline icon="DownloadIcon" onClick={importString}>
            Import
          </Button>
          <Toast
            open={showToast}
            title="Imported"
            content="Imported ramp successfully"
            onClose={() => setShowToast(false)}
            onOpenChange={setShowToast}
          >
            <Button outline icon="UploadIcon" onClick={importString} />
          </Toast>
          {/* Todo: Sane default */}
          {/* <CopyToClipboard text={"No ramp available for Dragonflight right now 😥"}>
            <Button icon="ClipboardCopyIcon">Copy Ramp Sequence</Button>
          </CopyToClipboard> */}
        </div>
      </div>
      <div className="flex flex-col">
        {Object.entries(SPELL_CATEGORIES).map(([key, spells]) => (
          <div key={key} className="mb-4">
            <h5 className="text-gray-600 font-semibold font-sans">{key}</h5>
            <div className="border-gray-300 border rounded drop-shadow-sm">
              {spells.map((spell) => (
                <DragSpell
                  onClick={(spell) =>
                    dispatch(addSimulationSpells({ spells: [toRampSpell(spell)] }))
                  }
                  key={spell.id + spell.name}
                  spell={spell}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
});
