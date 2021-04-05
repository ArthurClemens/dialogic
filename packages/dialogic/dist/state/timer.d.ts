import { Dialogic } from '../index';

export declare const Timer: () => {
  states: Dialogic.TimerStates;
  actions: {
    start: (callback: Dialogic.TimerCallback, duration: number) => void;
    stop: () => void;
    pause: () => void;
    resume: (minimumDuration?: number | undefined) => void;
    abort: () => void;
    done: () => void;
    refresh: () => void;
  };
  selectors: Dialogic.TimerStateSelectors;
};
