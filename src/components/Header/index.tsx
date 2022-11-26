import logo from "./fw.jpg";
import discordLogo from "./discord-mark-white.png";
import { Button } from "components/Button";
import React from "react";

const FUN_STRINGS = [
  "Attonment Simulator™️",
  "Atunement Simulator",
  "Atoner Simulator",
  "Atunment?",
  "Focused Will is a Much Happier Place",
  "Buff Disc",
  "Halo Should Apply Attonment",
  "Flash Concentration Coming Soon!",
  "I Miss 5.2 Mistweaver",
  "Power Word: Barrier Isn't That Good",
  "Now With 100% More Attonment",
  "Penance is working now!",
];

function _Header({ className }: { className?: string }) {
  return (
    <header className={"flex p-6 mb-4 justify-between".concat(` ${className}`)}>
      <div className="flex items-center">
        <img className="rounded-md inline-block w-14 mr-4" src={logo} alt="Focused Will logo" />
        <div className="inline-block align-middle">
          <h1 className="font-sans font-normal text-gray-500 dark:text-white text-xl tracking-tight">
            Ramp<span className="font-bold">Sim</span>
          </h1>
          <h2 className="font-semi-bold text-grey-600 dark:text-gray-400 text-lg tracking-tight italic font-serif">
            ❝ {FUN_STRINGS[Math.floor(Math.random() * FUN_STRINGS.length)]} ❞
          </h2>
        </div>
      </div>

      <div className="flex items-center">
        <a target="_" href="https://discord.gg/focusedwill">
          <Button className="bg-indigo-500 hover:bg-indigo-400">
            <img className="w-4 inline mr-2" src={discordLogo} alt="discord logo"></img>
            Visit the Discord!
          </Button>
        </a>
      </div>
    </header>
  );
}

export default React.memo(_Header);
