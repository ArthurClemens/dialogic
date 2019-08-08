import Stream from "mithril/stream";
import { Dialogic } from "..";

type PatchFn = (state: Dialogic.TimerState) => Dialogic.TimerState;

const initialState = {
  timerId: undefined,
  isPaused: undefined,
  remaining: undefined,
  startTime: undefined,
  callback: () => {},
  timeoutFn: () => {},
  promise: undefined,
  onDone: () => {},
  onAbort: () => {},
};

const appendStartTimer = (state: Dialogic.TimerState, callback: Dialogic.TimerCallback, duration: number, updateState: () => any) => {
  const timeoutFn = () => {
    callback();
    state.onDone();
    updateState();
  };
  return {
    timeoutFn,
    promise: new Promise((resolve, reject) => {
      state.onDone = () => resolve();
      state.onAbort = () => reject();
    }),
    ...(state.isPaused
      ? {}
      : {
        startTime: new Date().getTime(),
        timerId: window.setTimeout(timeoutFn, duration),
        remaining: duration,
      })
  };
};

const appendStopTimeout = (state: Dialogic.TimerState) => {
  window.clearTimeout(state.timerId);
  return {
    timerId: initialState.timerId
  };
};

const appendStopTimer = (state: Dialogic.TimerState) => {
  return {
    ...appendStopTimeout(state),
  };
};

const appendPauseTimer = (state: Dialogic.TimerState) => {
  return {
    ...appendStopTimeout(state),
    isPaused: true,
    remaining: getRemaining(state)
  };
};

const appendResumeTimer = (state: Dialogic.TimerState, minimumDuration?: number) => {
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
  state.remaining === undefined
    ? undefined
    : state.remaining - (new Date().getTime() - (state.startTime || 0));

export const Timer = () => {
  const timer = {
    initialState,
    actions: (update: Stream<PatchFn>) => {
      return {

        start: (callback: Dialogic.TimerCallback, duration: number) => {
          update((state: Dialogic.TimerState) => {
            return {
              ...state,
              ...appendStopTimeout(state),
              ...appendStartTimer(state, callback, duration, () => timer.actions(update).done()),
              ...(state.isPaused && appendPauseTimer(state)),
            };
          });
        },

        stop: () => {
          update((state: Dialogic.TimerState) => {
            return {
              ...state,
              ...appendStopTimer(state),
              ...initialState
            };
          })
        },

        pause: () => {
          update((state: Dialogic.TimerState) => {
            return {
              ...state,
              ...appendPauseTimer(state),
            }
          })
        },

        resume: (minimumDuration?: number) => {
          update((state: Dialogic.TimerState) => {
            return {
              ...state,
              ...(state.isPaused && appendResumeTimer(state, minimumDuration))
            }
          })
        },

        abort: () => {
          update((state: Dialogic.TimerState) => {
            state.onAbort();
            return {
              ...state,
              ...appendStopTimeout(state),
            }
          })
        },

        done: () => {
          update((state: Dialogic.TimerState) => {
            return initialState;
          })
        },

        refresh: () => {
          update((state: Dialogic.TimerState) => {
            return {
              ...state,
            }
          })
        },

      };

    },

    selectors: (states: Stream<Dialogic.TimerState>) => {
      return {

        isPaused: () => {
          const state = states();
          return state.isPaused;;
        },

        getRemaining: () => {
          timer.actions(update).refresh()
          const state = states();
          return state.isPaused
            ? state.remaining
            : getRemaining(state);
        },

        getResultPromise: () => {
          const state = states();
          return state.promise;
        },

      };

    },
  };

  const update: Stream<PatchFn> = Stream<PatchFn>();

  const states: Dialogic.TimerStates = Stream.scan(
    (state: Dialogic.TimerState, patch: PatchFn) => patch(state),
    {
      ...timer.initialState,
    },
    update
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
  }
};
