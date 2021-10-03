import Stream from "mithril-stream-standalone";
declare type TimerCallback = () => unknown;
declare type TOnFinishFn = () => void;
export declare const TimerStore: () => {
    states: Stream<{
        timerId?: number | undefined;
        startTime?: number | undefined;
        remaining: number | undefined;
        isPaused: boolean;
        callback: TimerCallback;
        timeoutFn: () => void;
        promise?: Promise<unknown> | undefined;
        onDone: TOnFinishFn;
        onAbort: TOnFinishFn;
    }>;
    actions: {
        /**
         * Starts the timer
         * @param {callback} Function Callback function that is called after completion.
         * @param {duration} Number Timer duration in milliseconds.
         */
        start: (callback: TimerCallback, duration: number) => void;
        /**
         * Stops the timer.
         */
        stop: () => void;
        /**
         * Pauses a running timer.
         */
        pause: () => void;
        /**
         * Resumes a paused timer.
         * @param {minimumDuration} Number Sets the minimum duration.
         */
        resume: (minimumDuration?: number | undefined) => void;
        /**
         * Aborts and clears a timer.
         */
        abort: () => void;
        /**
         * Updates the current state. Used to get the state for selectors.getRemaining.
         */
        refresh: () => void;
        /**
         * Brings the timer to its initial state.
         * Used internally.
         */
        done: () => void;
    };
    selectors: {
        /**
         * Returns the paused state.
         */
        isPaused: () => boolean;
        /**
         * Returns the remaining duration in milliseconds.
         */
        getRemaining: () => number | undefined;
        /**
         * The promise that is handled when the timer is done or canceled.
         */
        getResultPromise: () => Promise<unknown> | undefined;
    };
};
export declare type Timer = ReturnType<typeof TimerStore>;
export {};
