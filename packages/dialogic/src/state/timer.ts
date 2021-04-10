/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-use-before-define */
import Stream from 'mithril/stream';

type TimerCallback = () => unknown;
type TOnFinishFn = () => void;

type TimerState = {
  timerId?: number;
  startTime?: number;
  remaining: number | undefined;
  isPaused: boolean;
  callback: TimerCallback;
  timeoutFn: () => void;
  promise?: Promise<unknown>;
  onDone: TOnFinishFn;
  onAbort: TOnFinishFn;
};

type PatchFn = (state: TimerState) => TimerState;

const initialState: TimerState = {
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
  state: TimerState,
  callback: TimerCallback,
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

const appendStopTimeout = (state: TimerState) => {
  window.clearTimeout(state.timerId);
  return {
    timerId: initialState.timerId,
  };
};

const appendStopTimer = (state: TimerState) => ({
  ...appendStopTimeout(state),
});

const appendPauseTimer = (state: TimerState) => ({
  ...appendStopTimeout(state),
  isPaused: true,
  remaining: getRemaining(state),
});

const appendResumeTimer = (state: TimerState, minimumDuration?: number) => {
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

const getRemaining = (state: TimerState) =>
  state.remaining === 0 || state.remaining === undefined
    ? state.remaining
    : state.remaining - (new Date().getTime() - (state.startTime || 0));

export const TimerStore = () => {
  const timer = {
    initialState,
    actions: (update: Stream<PatchFn>) => ({
      /**
       * Starts the timer
       * @param {callback} Function Callback function that is called after completion.
       * @param {duration} Number Timer duration in milliseconds.
       */
      start: (callback: TimerCallback, duration: number) => {
        update((state: TimerState) => ({
          ...state,
          ...appendStopTimeout(state),
          ...appendStartTimer(state, callback, duration, () =>
            timer.actions(update).done(),
          ),
          ...(state.isPaused && appendPauseTimer(state)),
        }));
      },

      /**
       * Stops the timer.
       */
      stop: () => {
        update((state: TimerState) => ({
          ...state,
          ...appendStopTimer(state),
          ...initialState,
        }));
      },

      /**
       * Pauses a running timer.
       */
      pause: () => {
        update((state: TimerState) => ({
          ...state,
          ...(!state.isPaused && appendPauseTimer(state)),
        }));
      },

      /**
       * Resumes a paused timer.
       * @param {minimumDuration} Number Sets the minimum duration.
       */
      resume: (minimumDuration?: number) => {
        update((state: TimerState) => ({
          ...state,
          ...(state.isPaused && appendResumeTimer(state, minimumDuration)),
        }));
      },

      /**
       * Aborts and clears a timer.
       */
      abort: () => {
        update((state: TimerState) => {
          state.onAbort();
          return {
            ...state,
            ...appendStopTimeout(state),
          };
        });
      },

      /**
       * Updates the current state. Used to get the state for selectors.getRemaining.
       */
      refresh: () => {
        update((state: TimerState) => ({
          ...state,
        }));
      },

      /**
       * Brings the timer to its initial state.
       * Used internally.
       */
      done: () => {
        update(() => initialState);
      },
    }),

    selectors: (states: Stream<TimerState>) => ({
      /**
       * Returns the paused state.
       */
      isPaused: () => {
        const state = states();
        return state.isPaused;
      },

      /**
       * Returns the remaining duration in milliseconds.
       */
      getRemaining: () => {
        const state = states();
        return state.isPaused ? state.remaining : getRemaining(state);
      },

      /**
       * The promise that is handled when the timer is done or canceled.
       */
      getResultPromise: () => {
        const state = states();
        return state.promise;
      },
    }),
  };

  const update: Stream<PatchFn> = Stream<PatchFn>();

  const states = Stream.scan(
    (state: TimerState, patch: PatchFn) => patch(state),
    {
      ...timer.initialState,
    },
    update,
  );

  const actions = {
    ...timer.actions(update),
  };

  const selectors = {
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

export type Timer = ReturnType<typeof TimerStore>;
