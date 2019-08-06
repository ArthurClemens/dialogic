import m from "mithril";
import { states } from "dialogic";

export * from "./Dialog";
export * from "./Notification";

const DEBUG = false;

states.map(state => (
  DEBUG && console.log(JSON.stringify(state, null, 2)),
  m.redraw()
));
