
type RemainingProps = {
  getRemaining: () => number | undefined;
  exists: () => boolean;
  roundToSeconds?: boolean;
  callback: (displayValue: number | undefined) => any;
}

export const remaining = (props: RemainingProps) => {
  let displayValue: number | undefined;
  let reqId: number;
  let isActive: boolean;

  const update = () => {
    const remaining = props.getRemaining();
    if (!props.exists()) {
      window.cancelAnimationFrame(reqId);
      isActive = false;
      props.callback(undefined);
    } else {
      if (displayValue !== remaining) {
        displayValue = remaining === undefined
          ? remaining
          : props.roundToSeconds
            ? Math.round(Math.max(remaining, 0) / 1000)
            : Math.max(remaining, 0);
      }
    }
    props.callback(displayValue);
    if (isActive) {
      reqId = window.requestAnimationFrame(update);
    }
  };
  isActive = true;
  reqId = window.requestAnimationFrame(update);
};
