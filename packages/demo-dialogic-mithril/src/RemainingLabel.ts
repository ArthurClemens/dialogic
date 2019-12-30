import m from "mithril";
import { remaining } from "dialogic";
import { notification } from "dialogic-mithril";

export const RemainingLabel = () => {
  let remainingSeconds: number | undefined;
  remaining({
    instance: notification,
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
        remainingSeconds === undefined ? "0" : remainingSeconds.toString()
      )
    },
  }
};
