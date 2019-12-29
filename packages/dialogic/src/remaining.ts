
export type RemainingProps = {
  getRemaining: () => number | undefined;
  exists: () => boolean;
  roundToSeconds?: boolean;
  callback: (displayValue: number | undefined) => any;
}

export const remaining = (props: RemainingProps) => {
  let displayValue: number | undefined = undefined;
  let reqId: number;
  let isCanceled: boolean = false;

  const update = () => {
    const remaining = props.getRemaining();
    if (displayValue !== remaining) {
      displayValue = remaining === undefined
        ? remaining
        : props.roundToSeconds
          ? Math.round(Math.max(remaining, 0) / 1000)
          : Math.max(remaining, 0);
    }
    props.callback(displayValue);
    if (!props.exists()) {
      window.cancelAnimationFrame(reqId);
      isCanceled = true;
    } else if (!isCanceled) {
      reqId = window.requestAnimationFrame(update);
    }
  };
  reqId = window.requestAnimationFrame(update);
};
