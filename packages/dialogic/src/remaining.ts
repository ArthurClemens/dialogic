/**
 * Utility script that uses an animation frame to pass the current remaining value
 * (which is utilized when setting `timeout`).
 */

import type { DialogicInstance } from './types';

type RemainingProps = {
  /**
   * Dialogic instance: notification, dialog, or custom.
   */
  instance: DialogicInstance;

  id?: string;
  spawn?: string;

  /**
   * Set to true to return seconds instead of milliseconds.
   */
  roundToSeconds?: boolean;

  /**
   * Returns the remaining time as milliseconds. Returns `undefined` when the timer is not running (before and after the timer runs).
   */
  callback: (displayValue: number | undefined) => unknown;
};

export const remaining = (props: RemainingProps) => {
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
