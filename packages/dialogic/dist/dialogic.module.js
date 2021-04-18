import Stream from 'mithril/stream';

/* eslint-disable no-param-reassign */
const findItem = (id, items) => items.find(item => item.id === id);
const itemIndex = (id, items) => {
    const item = findItem(id, items);
    return item ? items.indexOf(item) : -1;
};
const removeItem = (id, items) => {
    const index = itemIndex(id, items);
    if (index !== -1) {
        items.splice(index, 1);
    }
    return items;
};
const createId = (identityOptions, ns) => [ns, identityOptions.id, identityOptions.spawn].filter(Boolean).join('-');
const store = {
    initialState: {
        store: {},
    },
    actions: (update) => ({
        /**
         * Add an item to the end of the list.
         */
        add: (ns, item) => {
            update((state) => {
                const items = state.store[ns] || [];
                state.store[ns] = [...items, item];
                if (item.timer) {
                    // When the timer state updates, refresh the store so that UI can pick up the change
                    item.timer.states.map(() => store.actions(update).refresh());
                }
                return state;
            });
        },
        /**
         * Removes the first item with a match on `id`.
         */
        remove: (ns, id) => {
            update((state) => {
                const items = state.store[ns] || [];
                const remaining = removeItem(id, items);
                state.store[ns] = remaining;
                return state;
            });
        },
        /**
         * Replaces the first item with a match on `id` with a newItem.
         */
        replace: (ns, id, newItem) => {
            update((state) => {
                const items = state.store[ns] || [];
                if (items) {
                    const index = itemIndex(id, items);
                    if (index !== -1) {
                        items[index] = newItem;
                        state.store[ns] = [...items];
                    }
                }
                return state;
            });
        },
        /**
         * Removes all items within a namespace.
         */
        removeAll: (ns) => {
            update((state) => {
                state.store[ns] = [];
                return state;
            });
        },
        /**
         * Replaces all items within a namespace.
         */
        store: (ns, newItems) => {
            update((state) => {
                state.store[ns] = [...newItems];
                return state;
            });
        },
        refresh: () => {
            update((state) => (Object.assign({}, state)));
        },
    }),
    selectors: (states) => {
        const fns = {
            getStore: () => {
                const state = states();
                return state.store;
            },
            find: (ns, identityOptions) => {
                const state = states();
                const items = state.store[ns] || [];
                const id = createId(identityOptions, ns);
                const item = items.find(fitem => fitem.id === id);
                return item ? { just: item } : { nothing: undefined };
            },
            getAll: (ns, identityOptions) => {
                const state = states();
                const items = (state.store[ns] || []);
                const spawn = identityOptions !== undefined ? identityOptions.spawn : undefined;
                const id = identityOptions !== undefined ? identityOptions.id : undefined;
                const itemsBySpawn = spawn !== undefined
                    ? items.filter(fitem => fitem.identityOptions.spawn === spawn)
                    : items;
                const itemsById = id !== undefined
                    ? itemsBySpawn.filter(item => item.identityOptions.id === id)
                    : itemsBySpawn;
                return itemsById;
            },
            getCount: (ns, identityOptions) => fns.getAll(ns, identityOptions).length,
        };
        return fns;
    },
};
const update = Stream();
const states = Stream.scan((state, patch) => patch(state), Object.assign({}, store.initialState), update);
const actions = Object.assign({}, store.actions(update));
const selectors = Object.assign({}, store.selectors(states));
// states.map(state =>
//   console.log(JSON.stringify(state, null, 2))
// );

/* eslint-disable no-param-reassign */
const initialState = {
    callback: () => { },
    isPaused: false,
    onAbort: () => { },
    onDone: () => { },
    promise: undefined,
    remaining: undefined,
    startTime: undefined,
    timeoutFn: () => { },
    timerId: undefined,
};
const appendStartTimer = (state, callback, duration, updateState) => {
    const timeoutFn = () => {
        callback();
        state.onDone();
        updateState();
    };
    return Object.assign({ timeoutFn, promise: new Promise(resolve => {
            state.onDone = () => resolve();
            state.onAbort = () => resolve();
        }) }, (state.isPaused
        ? {}
        : {
            startTime: new Date().getTime(),
            timerId: window.setTimeout(timeoutFn, duration),
            remaining: duration,
        }));
};
const appendStopTimeout = (state) => {
    window.clearTimeout(state.timerId);
    return {
        timerId: initialState.timerId,
    };
};
const appendStopTimer = (state) => (Object.assign({}, appendStopTimeout(state)));
const appendPauseTimer = (state) => (Object.assign(Object.assign({}, appendStopTimeout(state)), { isPaused: true, remaining: getRemaining$1(state) }));
const appendResumeTimer = (state, minimumDuration) => {
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
const getRemaining$1 = (state) => state.remaining === 0 || state.remaining === undefined
    ? state.remaining
    : state.remaining - (new Date().getTime() - (state.startTime || 0));
const TimerStore = () => {
    const timer = {
        initialState,
        actions: (update) => ({
            /**
             * Starts the timer
             * @param {callback} Function Callback function that is called after completion.
             * @param {duration} Number Timer duration in milliseconds.
             */
            start: (callback, duration) => {
                update((state) => (Object.assign(Object.assign(Object.assign(Object.assign({}, state), appendStopTimeout(state)), appendStartTimer(state, callback, duration, () => timer.actions(update).done())), (state.isPaused && appendPauseTimer(state)))));
            },
            /**
             * Stops the timer.
             */
            stop: () => {
                update((state) => (Object.assign(Object.assign(Object.assign({}, state), appendStopTimer(state)), initialState)));
            },
            /**
             * Pauses a running timer.
             */
            pause: () => {
                update((state) => (Object.assign(Object.assign({}, state), (!state.isPaused && appendPauseTimer(state)))));
            },
            /**
             * Resumes a paused timer.
             * @param {minimumDuration} Number Sets the minimum duration.
             */
            resume: (minimumDuration) => {
                update((state) => (Object.assign(Object.assign({}, state), (state.isPaused && appendResumeTimer(state, minimumDuration)))));
            },
            /**
             * Aborts and clears a timer.
             */
            abort: () => {
                update((state) => {
                    state.onAbort();
                    return Object.assign(Object.assign({}, state), appendStopTimeout(state));
                });
            },
            /**
             * Updates the current state. Used to get the state for selectors.getRemaining.
             */
            refresh: () => {
                update((state) => (Object.assign({}, state)));
            },
            /**
             * Brings the timer to its initial state.
             * Used internally.
             */
            done: () => {
                update(() => initialState);
            },
        }),
        selectors: (states) => ({
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
                return state.isPaused ? state.remaining : getRemaining$1(state);
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
    const update = Stream();
    const states = Stream.scan((state, patch) => patch(state), Object.assign({}, timer.initialState), update);
    const actions = Object.assign({}, timer.actions(update));
    const selectors = Object.assign({}, timer.selectors(states));
    // states.map(state =>
    //   console.log(JSON.stringify(state, null, 2))
    // );
    return {
        states,
        actions,
        selectors,
    };
};

const pipe = (...fns) => (x) => fns.filter(Boolean).reduce((y, f) => f(y), x);
const getStyleValue = ({ domElement, prop, }) => {
    const defaultView = document.defaultView;
    if (defaultView) {
        const style = defaultView.getComputedStyle(domElement);
        if (style) {
            return style.getPropertyValue(prop);
        }
    }
};

const MODE = {
    SHOW: 'show',
    HIDE: 'hide',
};
const removeTransitionClassNames = (domElement, transitionClassNames) => domElement.classList.remove(...transitionClassNames.showStart, ...transitionClassNames.showEnd, ...transitionClassNames.hideStart, ...transitionClassNames.hideEnd);
const applyTransitionStyles = (domElement, step, styles) => {
    const transitionStyle = styles[step];
    if (transitionStyle) {
        Object.keys(transitionStyle).forEach((key) => {
            // Workaround for error "getPropertyValue is not a function"
            const value = transitionStyle[key];
            // eslint-disable-next-line no-param-reassign
            domElement.style[key] = value;
        });
    }
};
const applyNoDurationTransitionStyle = (domElement) => {
    // eslint-disable-next-line no-param-reassign
    domElement.style.transitionDuration = '0ms';
};
const getTransitionStyles = (domElement, styles) => (typeof styles === 'function' ? styles(domElement) : styles) || {};
const createClassList = (className, step) => className.split(/ /).map((n) => `${n}-${step}`);
const applyStylesForState = (domElement, props, step, isEnterStep) => {
    if (props.styles) {
        const styles = getTransitionStyles(domElement, props.styles);
        applyTransitionStyles(domElement, 'default', styles);
        if (isEnterStep) {
            applyNoDurationTransitionStyle(domElement);
        }
        applyTransitionStyles(domElement, step, styles);
    }
    if (props.className) {
        const transitionClassNames = {
            showStart: createClassList(props.className, 'show-start'),
            showEnd: createClassList(props.className, 'show-end'),
            hideStart: createClassList(props.className, 'hide-start'),
            hideEnd: createClassList(props.className, 'hide-end'),
        };
        removeTransitionClassNames(domElement, transitionClassNames);
        if (transitionClassNames) {
            domElement.classList.add(...transitionClassNames[step]);
        }
    }
    // reflow
    // eslint-disable-next-line no-unused-expressions
    domElement.scrollTop;
};
const styleDurationToMs = (durationStr) => {
    const parsed = parseFloat(durationStr) * (durationStr.indexOf('ms') === -1 ? 1000 : 1);
    return Number.isNaN(parsed) ? 0 : parsed;
};
const getDuration = (domElement) => {
    const durationStyleValue = getStyleValue({
        domElement,
        prop: 'transition-duration',
    });
    const durationValue = durationStyleValue !== undefined
        ? styleDurationToMs(durationStyleValue)
        : 0;
    const delayStyleValue = getStyleValue({
        domElement,
        prop: 'transition-delay',
    });
    const delayValue = delayStyleValue !== undefined ? styleDurationToMs(delayStyleValue) : 0;
    return durationValue + delayValue;
};
const steps = {
    showStart: {
        nextStep: 'showEnd',
    },
    showEnd: {
        nextStep: undefined,
    },
    hideStart: {
        nextStep: 'hideEnd',
    },
    hideEnd: {
        nextStep: undefined,
    },
};
const transition = (props, mode) => {
    const { domElement } = props;
    if (!domElement) {
        return Promise.resolve('no domElement');
    }
    clearTimeout(props.__transitionTimeoutId__);
    let currentStep = mode === MODE.SHOW ? 'showStart' : 'hideStart';
    return new Promise(resolve => {
        applyStylesForState(domElement, props, currentStep, currentStep === 'showStart');
        setTimeout(() => {
            const { nextStep } = steps[currentStep];
            if (nextStep) {
                currentStep = nextStep;
                applyStylesForState(domElement, props, currentStep);
                // addEventListener sometimes hangs this function because it never finishes
                // Using setTimeout instead of addEventListener gives more consistent results
                const duration = getDuration(domElement);
                // eslint-disable-next-line no-param-reassign
                props.__transitionTimeoutId__ = window.setTimeout(resolve, duration);
            }
        }, 0);
    });
};

const localState = {
    uid: 0,
};
const getUid = () => {
    if (localState.uid === Number.MAX_VALUE) {
        localState.uid = 0;
    }
    else {
        localState.uid += 1;
    }
    return localState.uid;
};
var TransitionStates;
(function (TransitionStates) {
    TransitionStates[TransitionStates["Default"] = 0] = "Default";
    TransitionStates[TransitionStates["Displaying"] = 1] = "Displaying";
    TransitionStates[TransitionStates["Hiding"] = 2] = "Hiding";
})(TransitionStates || (TransitionStates = {}));
const getMaybeItem = (ns) => (defaultDialogicOptions) => (identityOptions) => selectors.find(ns, 
// eslint-disable-next-line @typescript-eslint/no-use-before-define
getMergedIdentityOptions(defaultDialogicOptions, identityOptions));
const filterBySpawn = (identityOptions) => (items) => identityOptions.spawn !== undefined
    ? items.filter(item => item.identityOptions.spawn === identityOptions.spawn)
    : items;
const filterById = (identityOptions) => (items) => identityOptions.id !== undefined
    ? items.filter(item => item.identityOptions.id === identityOptions.id)
    : items;
/**
 * Gets a list of all non-queued items.
 * From the queued items only the first item is listed.
 * */
const filterFirstInQueue = (nsItems) => {
    let queuedCount = 0;
    return nsItems
        .map(item => ({
        item,
        queueCount: item.dialogicOptions.queued ? queuedCount++ : 0,
    }))
        .filter(({ queueCount }) => queueCount === 0)
        .map(({ item }) => item);
};
const filterCandidates = (ns, items, identityOptions) => {
    const nsItems = (items[ns] || []);
    if (nsItems.length === 0) {
        return [];
    }
    return pipe(filterBySpawn(identityOptions), filterFirstInQueue)(nsItems);
};
const getPassThroughOptions = options => {
    const copy = Object.assign({}, options);
    delete copy.dialogic;
    return copy;
};
const getMergedIdentityOptions = (defaultDialogicOptions, identityOptions = {}) => ({
    id: identityOptions.id || defaultDialogicOptions.id,
    spawn: identityOptions.spawn || defaultDialogicOptions.spawn,
});
const handleOptions = (defaultDialogicOptions, options = {}) => {
    const identityOptions = {
        id: options.dialogic ? options.dialogic.id : undefined,
        spawn: options.dialogic ? options.dialogic.spawn : undefined,
    };
    const mergedIdentityOptions = getMergedIdentityOptions(defaultDialogicOptions || {}, identityOptions);
    const dialogicOptions = Object.assign(Object.assign(Object.assign({}, defaultDialogicOptions), options.dialogic), { __transitionTimeoutId__: 0 });
    const passThroughOptions = getPassThroughOptions(options);
    return {
        identityOptions: mergedIdentityOptions,
        dialogicOptions,
        passThroughOptions,
    };
};
const createInstance = (ns) => (defaultDialogicOptions) => (options) => {
    const { identityOptions, dialogicOptions, passThroughOptions, } = handleOptions(defaultDialogicOptions, options);
    // eslint-disable-next-line consistent-return
    return new Promise(resolve => {
        const callbacks = {
            willShow: (item) => {
                if (dialogicOptions.willShow) {
                    dialogicOptions.willShow(item);
                }
                return resolve(item);
            },
            willHide: (item) => {
                if (dialogicOptions.willHide) {
                    dialogicOptions.willHide(item);
                }
                return resolve(item);
            },
            didShow: (item) => {
                if (dialogicOptions.didShow) {
                    dialogicOptions.didShow(item);
                }
                return resolve(item);
            },
            didHide: (item) => {
                if (dialogicOptions.didHide) {
                    dialogicOptions.didHide(item);
                }
                return resolve(item);
            },
        };
        const item = {
            ns,
            identityOptions,
            dialogicOptions,
            callbacks,
            passThroughOptions,
            id: createId(identityOptions, ns),
            timer: dialogicOptions.timeout ? TimerStore() : undefined,
            key: getUid().toString(),
            transitionState: TransitionStates.Default,
        };
        const maybeExistingItem = selectors.find(ns, identityOptions);
        const existingItem = maybeExistingItem.just;
        if (existingItem && dialogicOptions.toggle) {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            hide(ns)(defaultDialogicOptions)(options);
            return resolve(existingItem);
        }
        if (existingItem && !dialogicOptions.queued) {
            const replacingItem = Object.assign(Object.assign({}, item), { key: existingItem.key, transitionState: existingItem.transitionState, dialogicOptions: existingItem.dialogicOptions });
            actions.replace(ns, existingItem.id, replacingItem);
        }
        else {
            actions.add(ns, item);
            // This will instantiate and draw the instance
            // The instance will call `showDialog` in `onMount`
        }
        resolve(item);
    });
};
const show = createInstance;
const hide = (ns) => (defaultDialogicOptions) => (options) => {
    const { identityOptions, dialogicOptions, passThroughOptions, } = handleOptions(defaultDialogicOptions, options);
    const maybeExistingItem = selectors.find(ns, identityOptions);
    const existingItem = maybeExistingItem.just;
    if (existingItem) {
        const item = Object.assign(Object.assign({}, existingItem), { dialogicOptions: Object.assign(Object.assign({}, existingItem.dialogicOptions), dialogicOptions), passThroughOptions: Object.assign(Object.assign({}, existingItem.passThroughOptions), { passThroughOptions }) });
        actions.replace(ns, existingItem.id, item);
        if (item.transitionState !== TransitionStates.Hiding) {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            return hideItem(item);
        }
        return Promise.resolve(item);
    }
    return Promise.resolve({
        ns,
        id: identityOptions.id,
    });
};
const pause = (ns) => (
// eslint-disable-next-line @typescript-eslint/no-unused-vars
defaultDialogicOptions) => (identityOptions) => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const validItems = getValidItems(ns, identityOptions).filter(item => !!item.timer);
    validItems.forEach((item) => {
        if (item.timer) {
            item.timer.actions.pause();
        }
    });
    return Promise.all(validItems);
};
const resume = (ns) => (
// eslint-disable-next-line @typescript-eslint/no-unused-vars
defaultDialogicOptions) => (commandOptions) => {
    const options = commandOptions || {};
    const identityOptions = {
        id: options.id,
        spawn: options.spawn,
    };
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const validItems = getValidItems(ns, identityOptions).filter(item => !!item.timer);
    validItems.forEach((item) => {
        if (item.timer) {
            item.timer.actions.resume(options.minimumDuration);
        }
    });
    return Promise.all(validItems);
};
const getTimerSelectors = (ns, defaultDialogicOptions, identityOptions) => {
    var _a, _b;
    const maybeItem = getMaybeItem(ns)(defaultDialogicOptions)(identityOptions);
    return (_b = (_a = maybeItem === null || maybeItem === void 0 ? void 0 : maybeItem.just) === null || _a === void 0 ? void 0 : _a.timer) === null || _b === void 0 ? void 0 : _b.selectors;
};
const isPaused = (ns) => (defaultDialogicOptions) => (identityOptions) => {
    var _a;
    return ((_a = getTimerSelectors(ns, defaultDialogicOptions, identityOptions)) === null || _a === void 0 ? void 0 : _a.isPaused()) ||
        false;
};
const getRemaining = (ns) => (defaultDialogicOptions) => (identityOptions) => {
    var _a;
    return ((_a = getTimerSelectors(ns, defaultDialogicOptions, identityOptions)) === null || _a === void 0 ? void 0 : _a.getRemaining()) || undefined;
};
const exists = (ns) => (
// eslint-disable-next-line @typescript-eslint/no-unused-vars
defaultDialogicOptions) => (identityOptions) => 
// eslint-disable-next-line @typescript-eslint/no-use-before-define
!!getValidItems(ns, identityOptions).length;
const getValidItems = (ns, identityOptions) => {
    const allItems = selectors.getAll(ns);
    let validItems;
    if (identityOptions) {
        validItems = pipe(filterBySpawn(identityOptions), filterById(identityOptions))(allItems);
    }
    else {
        validItems = allItems;
    }
    return validItems;
};
const resetAll = (ns) => (
// eslint-disable-next-line @typescript-eslint/no-unused-vars
defaultDialogicOptions) => (identityOptions) => {
    const validItems = getValidItems(ns, identityOptions);
    const items = [];
    validItems.forEach((item) => {
        if (item.timer) {
            item.timer.actions.abort();
        }
        items.push(item);
    });
    if (identityOptions) {
        items.forEach((item) => {
            actions.remove(ns, item.id);
        });
    }
    else {
        actions.removeAll(ns);
    }
    return Promise.resolve(items);
};
const getOverridingTransitionOptions = (item, dialogicOptions) => (Object.assign(Object.assign({}, item), { dialogicOptions: Object.assign(Object.assign({}, item.dialogicOptions), dialogicOptions) }));
/**
 * Triggers a `hideItem` for each item in the store.
 * Queued items: will trigger `hideItem` only for the first item, then reset the store.
 * Optional `dialogicOptions` may be passed with specific transition options. This comes in handy when all items should hide in the same way.
 */
const hideAll = (ns) => (
// eslint-disable-next-line @typescript-eslint/no-unused-vars
defaultDialogicOptions) => (dialogicOptions) => {
    const options = dialogicOptions || {};
    const identityOptions = {
        id: options.id,
        spawn: options.spawn,
    };
    const validItems = getValidItems(ns, identityOptions);
    const regularItems = validItems.filter((item) => !options.queued && !item.dialogicOptions.queued);
    const queuedItems = validItems.filter((item) => options.queued || item.dialogicOptions.queued);
    const items = [];
    regularItems.forEach((item) => 
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    items.push(hideItem(getOverridingTransitionOptions(item, options))));
    if (queuedItems.length > 0) {
        const [current] = queuedItems;
        // Make sure that any remaining items don't suddenly appear
        actions.store(ns, [current]);
        // Transition the current item
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        items.push(hideItem(getOverridingTransitionOptions(current, options)));
    }
    return Promise.all(items);
};
const getCount = (ns) => (identityOptions) => selectors.getCount(ns, identityOptions);
const transitionItem = (item, mode) => transition(item.dialogicOptions, mode);
const getResultPromise = () => (ns) => (defaultDialogicOptions) => (identityOptions) => {
    const maybeItem = getMaybeItem(ns)(defaultDialogicOptions)(identityOptions);
    if (maybeItem.just) {
        if (maybeItem.just && maybeItem.just.timer) {
            return maybeItem.just.timer.selectors.getResultPromise();
        }
        return undefined;
    }
    return undefined;
};
const deferredHideItem = async (item, timer, timeout) => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    timer.actions.start(() => hideItem(item), timeout);
    return getResultPromise();
};
const showItem = async (item) => {
    if (item.callbacks.willShow) {
        item.callbacks.willShow(item);
    }
    if (item.transitionState !== TransitionStates.Displaying) {
        // eslint-disable-next-line no-param-reassign
        item.transitionState = TransitionStates.Displaying;
        await transitionItem(item, MODE.SHOW);
    }
    if (item.callbacks.didShow) {
        item.callbacks.didShow(item);
    }
    if (item.dialogicOptions.timeout && item.timer) {
        await deferredHideItem(item, item.timer, item.dialogicOptions.timeout);
    }
    return Promise.resolve(item);
};
/**
 * Hides an item. Any timer will be stopped. Any callbacks will be called.
 * @returns A Promise with (a copy of) the data of the removed item.
 */
const hideItem = async (item) => {
    // eslint-disable-next-line no-param-reassign
    item.transitionState = TransitionStates.Hiding;
    // Stop any running timer
    if (item.timer) {
        item.timer.actions.stop();
    }
    if (item.callbacks.willHide) {
        item.callbacks.willHide(item);
    }
    await transitionItem(item, MODE.HIDE);
    if (item.callbacks.didHide) {
        item.callbacks.didHide(item);
    }
    const copy = Object.assign({}, item);
    actions.remove(item.ns, item.id);
    return Promise.resolve(copy);
};
const setDomElement = (domElement, item) => {
    // eslint-disable-next-line no-param-reassign
    item.dialogicOptions.domElement = domElement;
};

const dialogical = ({ ns, queued, timeout, }) => {
    const defaultId = `default_${ns}`;
    const defaultSpawn = `default_${ns}`;
    const defaultDialogicOptions = Object.assign(Object.assign({ id: defaultId, spawn: defaultSpawn }, (queued && { queued })), (timeout !== undefined && { timeout }));
    return {
        // Identification
        ns,
        defaultId,
        defaultSpawn,
        // Configuration
        defaultDialogicOptions,
        // Commands
        show: show(ns)(defaultDialogicOptions),
        hide: hide(ns)(defaultDialogicOptions),
        hideAll: hideAll(ns)(defaultDialogicOptions),
        resetAll: resetAll(ns)(defaultDialogicOptions),
        // Timer commands
        pause: pause(ns)(defaultDialogicOptions),
        resume: resume(ns)(defaultDialogicOptions),
        // State
        exists: exists(ns)(defaultDialogicOptions),
        getCount: getCount(ns),
        // Timer state
        isPaused: isPaused(ns)(defaultDialogicOptions),
        getRemaining: getRemaining(ns)(defaultDialogicOptions),
    };
};

const dialog = dialogical({ ns: 'dialog' });

const notification = dialogical({
    ns: 'notification',
    queued: true,
    timeout: 3000,
});

/**
 * Utility script that uses an animation frame to pass the current remaining value
 * (which is utilized when setting `timeout`).
 */
const remaining = (props) => {
    let displayValue;
    let reqId;
    let isCanceled = false;
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
        }
        else if (!isCanceled) {
            reqId = window.requestAnimationFrame(update);
        }
    };
    reqId = window.requestAnimationFrame(update);
};

var types = /*#__PURE__*/Object.freeze({
    __proto__: null
});

export { types as Dialogic, actions, dialog, dialogical, exists, filterCandidates, getCount, getRemaining, hide, hideAll, hideItem, isPaused, notification, pause, remaining, resetAll, resume, selectors, setDomElement, show, showItem, states };
