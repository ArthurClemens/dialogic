/**
 * Utility script that uses an animation frame to pass the current remaining value
 * (which is utilized when setting `timeout`).
 */

import { Dialogic } from '../index';

export const remaining = (props: Dialogic.RemainingProps) => {
  let displayValue: number | undefined = undefined;
  let reqId: number;
  let isCanceled: boolean = false;
  const identity = {
    id: props.id,
    spawn: props.spawn,
  };

  const update = () => {
    const remaining = props.instance.getRemaining(identity);
    if (displayValue !== remaining) {
      displayValue =
        remaining === undefined
          ? remaining
          : props.roundToSeconds
          ? Math.round(Math.max(remaining, 0) / 1000)
          : Math.max(remaining, 0);
    }
    props.callback(displayValue);
    if (!props.instance.exists(identity)) {
      window.cancelAnimationFrame(reqId);
      isCanceled = true;
    } else if (!isCanceled) {
      reqId = window.requestAnimationFrame(update);
    }
  };
  reqId = window.requestAnimationFrame(update);
};
