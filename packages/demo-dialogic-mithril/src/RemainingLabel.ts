import m from "mithril";
import { remaining } from "dialogic";
import { notification } from "dialogic-mithril";

export const RemainingLabel = () => {
  let remainingSeconds: number | undefined;
  remaining({
    getRemaining: notification.getRemaining,
    exists: () => true, // always run
    roundToSeconds: false,
    callback: (value) => {
      remainingSeconds = value;
      m.redraw();
    },
  });
  
  return {
    view: () => {
      return m("span",
        {
          style: {
            minWidth: "3em",
            textAlign: "left"
          }
        },
        remainingSeconds === undefined ? "undefined" : remainingSeconds.toString()
      )
    },
  }
};
