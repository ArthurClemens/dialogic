import m from "mithril";

export const Remaining = ({ attrs } : { attrs: { getRemaining: () => number | undefined }}) => {
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
  reqId = window.requestAnimationFrame(update);

  return {
    onremove: () => window.cancelAnimationFrame(reqId),
    view: () => 
      m("div", `Remaining: ${displayValue}`)
  }
};
