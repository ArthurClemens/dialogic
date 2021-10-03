import { dialog, Dialogic, notification } from "dialogic";
import React from "react";
import { Dialogical } from "./Dialogical";

const Dialog = (props: Dialogic.ComponentOptions) => (
  <Dialogical {...props} instance={dialog} />
);
const Notification = (props: Dialogic.ComponentOptions) => (
  <Dialogical {...props} instance={notification} />
);

export { dialog, Dialogic, notification, remaining } from "dialogic";
export * from "./useDialogic";
export * from "./useDialogicState";
export * from "./useRemaining";
export { Dialog, Notification, Dialogical };
