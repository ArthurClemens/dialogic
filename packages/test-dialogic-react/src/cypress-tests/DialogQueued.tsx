import React from "react";
import { createFns } from "./createFns";
import { Default } from "../content/Default";
import { buttons } from "./buttons";
import { dialog, Dialog, useDialogicState } from "dialogic-react";

export default () => {
  useDialogicState();
  const fns1 = createFns({ instance: dialog, component: Default, className: "dialog", title: "Default", queued: true });

  return (
    <div className="test">
      <div className="control" data-test-id="count-all">{`Count all: ${dialog.getCount()}`}</div>
      <div className="content">
        {buttons(fns1)}
      </div>
      <div className="spawn default-spawn">
        <Dialog />
      </div>
    </div> 
  );
};
