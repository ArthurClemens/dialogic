import React, { useEffect } from "react";
import { createFns } from "./createFns";
import { Default } from "../content/Default";
import { buttons } from "./buttons";
import { dialog, Dialog } from "dialogic-react";

export default () => {
  useEffect(
    () => {
      dialog.resetAll();
    },
    []
  );
  const fns = createFns({ instance: dialog, component: Default, className: "dialog", title: "DialogClassName" });

  return (
    <div className="test">
      {buttons(fns)}
      <div className="spawn default-spawn">
        <Dialog />
      </div>
    </div> 
  );
};
