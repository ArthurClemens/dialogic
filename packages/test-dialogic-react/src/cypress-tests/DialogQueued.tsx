import React, { useEffect } from "react";
import { createFns } from "./createFns";
import { Default } from "../content/Default";
import { Buttons } from "./Buttons";
import { dialog, Dialog, useDialogicState } from "dialogic-react";

export default () => {
  useEffect(
    () => {
      dialog.resetAll();
    },
    []
  );
  useDialogicState();
  const fns = createFns({ instance: dialog, component: Default, className: "dialog", title: "Default", queued: true });

  return (
    <div className="test">
      <div className="control" data-test-id="count-all">{`Count all: ${dialog.getCount()}`}</div>
      <div className="content">
        <Buttons {...fns} />
      </div>
      <div className="spawn default-spawn">
        <Dialog />
      </div>
    </div> 
  );
};
