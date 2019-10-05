import React from "react";
import { createFns } from "./createFns";
import { Default } from "../content/Default";
import { buttons } from "./buttons";
import { dialog, Dialog } from "dialogic-react";

export default () => {
  dialog.resetAll();
  const fns1 = createFns({ instance: dialog, component: Default, className: "dialog", title: "DialogIds default" });
  const fns2 = createFns({ instance: dialog, component: Default, className: "dialog", id: "1", title: "DialogIds 1" });
  const fns3 = createFns({ instance: dialog, component: Default, className: "dialog", id: "2", title: "DialogIds 2" });

  return (
    <div className="test">
      {buttons({ ...fns1 })}
      {buttons({ ...fns2, id: "1" })}
      {buttons({ ...fns3, id: "2" })}
      <div className="spawn default-spawn">
        <Dialog />
      </div>
    </div> 
  );
};
