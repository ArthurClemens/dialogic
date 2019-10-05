import React from "react";
import { createFns } from "./createFns";
import { Default } from "../content/Default";
import { buttons } from "./buttons";
import { notification, Notification, useDialogicState } from "dialogic-react";

export default () => {
  useDialogicState();
  const fns1 = createFns({ instance: notification, component: Default, className: "notification", title: "Default" });
  const fns2 = createFns({ instance: notification, component: Default, className: "notification", id: "1", title: "ID" });
  const fns3 = createFns({ instance: notification, component: Default, className: "notification", spawn: "1", title: "Spawn" });
  const fns4 = createFns({ instance: notification, component: Default, className: "notification", spawn: "1", id: "1", title: "Spawn and ID" });
  
  return (
    <div className="test">
      <div className="control" data-test-id="count-all">{`Count all: ${notification.getCount()}`}</div>
      <div className="control" data-test-id="count-id">{`Count id: ${notification.getCount({ id: "1" })}`}</div>
      <div className="control" data-test-id="count-spawn">{`Count spawn: ${notification.getCount({ spawn: "1" })}`}</div>
      <div className="control" data-test-id="count-spawn-id">{`Count spawn, id: ${notification.getCount({ spawn: "1", id: "1" })}`}</div>
      <div className="control">
        <div className="buttons">
          <button className="button" data-test-id="button-reset" onClick={() => notification.resetAll()}>
            Reset
          </button>
        </div>
      </div>
      <div className="content">
        {buttons({ ...fns1 })}
        {buttons({ ...fns2, id: "1" })}
        {buttons({ ...fns3, spawn: "1" })}
        {buttons({ ...fns4, spawn: "1", id: "1" })}
      </div>
      <div className="spawn default-spawn">
        <Notification />
      </div>
      <div className="spawn custom-spawn">
        <Notification spawn="1" />
      </div>
    </div> 
  );
};
