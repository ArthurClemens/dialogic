/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-use-before-define */
import Stream from 'mithril/stream';

import { Dialogic } from '../index';

type PatchFn = (state: Dialogic.TimerState) => Dialogic.TimerState;

const initialState = {
  callback: () => {},
  isPaused: false,
  onAbort: () => {},
  onDone: () => {},
  promise: undefined,
  remaining: undefined,
  startTime: undefined,
  timeoutFn: () => {},
  timerId: undefined,
};

const appendStartTimer = (
  state: Dialogic.TimerState,
  callback: Dialogic.TimerCallback,
  duration: number,
  updateState: () => unknown,
) => {
  const timeoutFn = () => {
    callback();
    state.onDone();
    updateState();
  };
  return {
    timeoutFn,
    promise: new Promise<void>(resolve => {
      state.onDone = () => resolve();
      state.onAbort = () => resolve();
    }),
    ...(state.isPaused
      ? {}
      : {
          startTime: new Date().getTime(),
          timerId: window.setTimeout(timeoutFn, duration),
          remaining: duration,
        }),
  };
};

const appendStopTimeout = (state: Dialogic.TimerState) => {
  window.clearTimeout(state.timerId);
  return {
    timerId: initialState.timerId,
  };
};

const appendStopTimer = (state: Dialogic.TimerState) => ({
  ...appendStopTimeout(state),
});

const appendPauseTimer = (state: Dialogic.TimerState) => ({
  ...appendStopTimeout(state),
  isPaused: true,
  remaining: getRemaining(state),
});

const appendResumeTimer = (
  state: Dialogic.TimerState,
  minimumDuration?: number,
) => {
  window.clearTimeout(state.timerId);
  const remaining = minimumDuration
    ? Math.max(state.remaining || 0, minimumDuration)
    : state.remaining;
  return {
    startTime: new Date().getTime(),
    isPaused: false,
    remaining,
    timerId: window.setTimeout(state.timeoutFn, remaining),
  };
};

const getRemaining = (state: Dialogic.TimerState) =>
  state.remaining === 0 || state.remaining === undefined
    ? state.remaining
    : state.remaining - (new Date().getTime() - (state.startTime || 0));

export const Timer = () => {
  const timer = {
    initialState,
    actions: (update: Stream<PatchFn>) => ({
      start: (callback: Dialogic.TimerCallback, duration: number) => {
        update((state: Dialogic.TimerState) => ({
          ...state,
          ...appendStopTimeout(state),
          ...appendStartTimer(state, callback, duration, () =>
            timer.actions(update).done(),
          ),
          ...(state.isPaused && appendPauseTimer(state)),
        }));
      },

      stop: () => {
        update((state: Dialogic.TimerState) => ({
          ...state,
          ...appendStopTimer(state),
          ...initialState,
        }));
      },

      pause: () => {
        update((state: Dialogic.TimerState) => ({
          ...state,
          ...(!state.isPaused && appendPauseTimer(state)),
        }));
      },

      resume: (minimumDuration?: number) => {
        update((state: Dialogic.TimerState) => ({
          ...state,
          ...(state.isPaused && appendResumeTimer(state, minimumDuration)),
        }));
      },

      abort: () => {
        update((state: Dialogic.TimerState) => {
          state.onAbort();
          return {
            ...state,
            ...appendStopTimeout(state),
          };
        });
      },

      done: () => {
        update(() => initialState);
      },

      refresh: () => {
        update((state: Dialogic.TimerState) => ({
          ...state,
        }));
      },
    }),

    selectors: (states: Stream<Dialogic.TimerState>) => ({
      isPaused: () => {
        const state = states();
        return state.isPaused;
      },

      getRemaining: () => {
        const state = states();
        return state.isPaused ? state.remaining : getRemaining(state);
      },

      getResultPromise: () => {
        const state = states();
        return state.promise;
      },
    }),
  };

  const update: Stream<PatchFn> = Stream<PatchFn>();

  const states: Dialogic.TimerStates = Stream.scan(
    (state: Dialogic.TimerState, patch: PatchFn) => patch(state),
    {
      ...timer.initialState,
    },
    update,
  );

  const actions = {
    ...timer.actions(update),
  };

  const selectors: Dialogic.TimerStateSelectors = {
    ...timer.selectors(states),
  };

  // states.map(state =>
  //   console.log(JSON.stringify(state, null, 2))
  // );

  return {
    states,
    actions,
    selectors,
  };
};
