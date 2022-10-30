import React from "react";
import { createRoot } from "react-dom/client";
import * as Toast from "@radix-ui/react-toast";

import "./index.css";
import "tippy.js/dist/tippy.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { SimulationsProvider } from "context/simulations";
import { QuickFill } from "features/QuickFill";

const container = document.getElementById("root");
if (container === null) {
  throw new Error("Could not find root!");
}

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Toast.Provider swipeDirection="right">
      <SimulationsProvider>
        <DndProvider backend={HTML5Backend}>
          <QuickFill />
          <App />
          <Toast.Viewport className="fixed bottom-4 right-4 z-50" />
        </DndProvider>
      </SimulationsProvider>
    </Toast.Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
