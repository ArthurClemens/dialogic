import m from "mithril";
import { states } from "dialogic";

export * from "./Dialog";
export * from "./Notification";

states.map(state => (
  // console.log(JSON.stringify(state, null, 2)),
  m.redraw()
));
