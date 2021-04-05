/**
 * Utility script that uses an animation frame to pass the current remaining value
 * (which is utilized when setting `timeout`).
 */

import { Dialogic } from './index';

export const remaining = (props: Dialogic.RemainingProps) => {
  let displayValue: number | undefined;
  let reqId: number;
  let isCanceled: boolean = false;
  const identity = {
    id: props.id,
    spawn: props.spawn,
  };

  const update = () => {
    const remainingValue = props.instance.getRemaining(identity);
    if (displayValue !== remainingValue) {
      displayValue =
        remainingValue === undefined
          ? remainingValue
          : props.roundToSeconds
          ? Math.round(Math.max(remainingValue, 0) / 1000)
          : Math.max(remainingValue, 0);
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
