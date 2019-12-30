/**
 * Utility script that uses an animation frame to pass the current remaining value
 * (which is utilized when setting `timeout`).
 */

import { Dialogic } from "../index";

export type RemainingProps = {
  /**
   * Dialogic instance: notification, dialog, or custom.
   */
  instance: Dialogic.DialogicInstance;

  /**
   * Set to true to return seconds instead of milliseconds.
   */
  roundToSeconds?: boolean;

  /**
   * Returns the remaining time as milliseconds. Returns `undefined` when the timer is not running (before and after the timer runs).
   */
  callback: (displayValue: number | undefined) => any;
}

export const remaining = (props: RemainingProps) => {
  let displayValue: number | undefined = undefined;
  let reqId: number;
  let isCanceled: boolean = false;

  const update = () => {
    const remaining = props.instance.getRemaining();
    if (displayValue !== remaining) {
      displayValue = remaining === undefined
        ? remaining
        : props.roundToSeconds
          ? Math.round(Math.max(remaining, 0) / 1000)
          : Math.max(remaining, 0);
    }
    props.callback(displayValue);
    if (!props.instance.exists()) {
      window.cancelAnimationFrame(reqId);
      isCanceled = true;
    } else if (!isCanceled) {
      reqId = window.requestAnimationFrame(update);
    }
  };
  reqId = window.requestAnimationFrame(update);
};
