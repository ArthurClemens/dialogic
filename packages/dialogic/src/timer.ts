import { isClient } from "./iso";

import { Dialogic } from "../index";

type TTimerFn = () => Dialogic.TTimer;
type TOnFinishFn = () => void;

export const Timer: TTimerFn = () => {

  let timerId: number;
  let startTime: number;
  let remaining: number;
  let cb: Dialogic.TCallback;
  let onDone: TOnFinishFn; 
  let onAbort: TOnFinishFn;

  const stop = () => {
    if (isClient) {
      window.clearTimeout(timerId);
      timerId = -1;
    }
  };

  const abort = () => (
    stop(),
    onAbort && onAbort()
  );

  const pause = () => (
    stop(),
    remaining -= new Date().getTime() - startTime
  );

  const startTimer = () => {
    if (isClient) {
      stop();
      startTime = new Date().getTime();
      timerId = window.setTimeout(() => {
        cb();
        onDone();
       }, remaining);
    }
  };

  const start = (callback: Dialogic.TCallback, duration: number) => {
    cb = callback;
    remaining = duration;
    return new Promise((resolve, reject) => {
      onDone = () => resolve();
      onAbort = () => resolve();
      startTimer();
    })
  };

  const resume = () => {
    if (timerId === -1) {
      return startTimer();
    }
  };

  return {
    start,
    pause,
    resume,
    stop,
    abort,
  };
};
