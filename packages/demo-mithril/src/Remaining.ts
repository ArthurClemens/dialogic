import m, { Component } from "mithril";

type RemainingProps = {
  getRemaining: () => number | undefined;
}

type RemainingFn = ({ attrs } : { attrs: RemainingProps }) => Component<RemainingProps>;

export const Remaining: RemainingFn = ({ attrs }) => {
  let displayValue: number | undefined;
  let reqId: number;

  const update = () => {
    const remaining = attrs.getRemaining();
    if (remaining !== undefined) {
      if (displayValue !== remaining) {
        m.redraw();
        displayValue = Math.max(remaining, 0);
      }
    } else {
      displayValue = undefined;
      m.redraw();
    }
    reqId = window.requestAnimationFrame(update);
  };
  
  return {
    oncreate: () => reqId = window.requestAnimationFrame(update),
    onremove: () => window.cancelAnimationFrame(reqId),
    view: () => 
      m("div", `Remaining: ${displayValue}`)
  }
};
