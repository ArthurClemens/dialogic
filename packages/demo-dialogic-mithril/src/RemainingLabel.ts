import { notification, remaining } from "dialogic-mithril";
import m from "mithril";

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
    view: () =>
      m(
        "span",
        {
          style: {
            minWidth: "3em",
            textAlign: "left",
          },
        },
        remainingSeconds === undefined ? "0" : remainingSeconds.toString()
      ),
  };
};
