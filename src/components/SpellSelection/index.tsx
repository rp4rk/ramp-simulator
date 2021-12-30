import CopyToClipboard from "react-copy-to-clipboard";
import { DragSpell } from "components/Spell";
import { Spells } from "lib";
import { Spell as SpellType, SpellCategory } from "lib/types";
import { Button } from "components/Button";
import React, { useCallback, useContext } from "react";
import { SimulationsContext } from "context/simulations";
import { isSerializedSimulationState } from "context/simulations.selectors";
import clipboard from "clipboardy";
import lzbase62 from "lzbase62";
import { importSimulation } from "context/simulations.actions";

const RAMP_SEQUENCE = `ramp-uDritjZdDkRkVrisS2MtYVRcZeX2LsIEritURdRXxWDxLDtRSjfiSxLFtSlWWj2KtLN2Ltk25xfGtgcRuBtViyDEtjgVccgfnxOEsKI2B2ctYRjyeEsRRxMD3TxMDtiuB2OsLNxODtTiZkxLHtm2WyXDsM2wuFxXDtffcU3FteyoFxQD2ltVdy0Hti4YtgDylExQEsNPRExEEsMPNLOEJPxDY3H`;

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

    dispatch(
      importSimulation({
        simulation: parsedValue,
      })
    );
  }, [dispatch]);

  return (
    <>
      <div className="flex justify-between mb-4">
        <h4 className="text-lg text-gray-600 font-semibold">Spell Selection</h4>
        <div className="space-x-2">
          <Button outline icon="DownloadIcon" onClick={importString}>
            Import
          </Button>
          <CopyToClipboard text={RAMP_SEQUENCE}>
            <Button icon="ClipboardCopyIcon">Copy Ramp Sequence</Button>
          </CopyToClipboard>
        </div>
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
