import Stream from 'mithril/stream';
export { default as Stream } from 'mithril/stream';

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
    SHOW: "show",
    HIDE: "hide"
};
const removeTransitionClassNames = (domElement, transitionClassNames) => domElement.classList.remove(...transitionClassNames.showStart, ...transitionClassNames.showEnd, ...transitionClassNames.hideStart, ...transitionClassNames.hideEnd);
const applyTransitionStyles = (domElement, step, styles) => {
    const transitionStyle = styles[step] || {};
    Object.keys(transitionStyle).forEach((key) => {
        const value = transitionStyle[key].toString();
        domElement.style[key] = value;
        // if (domElement.style[key] !== value) {
        // 	console.warn(`Invalid style: ${key}: ${value} (${domElement.style[key]})`);
        // }
    });
};
const applyNoDurationTransitionStyle = (domElement) => domElement.style.transitionDuration = "0ms";
const getTransitionStyles = (domElement, styles) => (typeof styles === "function"
    ? styles(domElement)
    : styles) || {};
const createClassList = (className, step) => className.split(/ /).map((n) => `${n}-${step}`);
const applyStylesForState = (domElement, props, step, isEnterStep) => {
    if (props.styles) {
        const styles = getTransitionStyles(domElement, props.styles);
        applyTransitionStyles(domElement, "default", styles);
        isEnterStep && applyNoDurationTransitionStyle(domElement);
        applyTransitionStyles(domElement, step, styles);
    }
    if (props.className) {
        const transitionClassNames = {
            showStart: createClassList(props.className, "show-start"),
            showEnd: createClassList(props.className, "show-end"),
            hideStart: createClassList(props.className, "hide-start"),
            hideEnd: createClassList(props.className, "hide-end"),
        };
        removeTransitionClassNames(domElement, transitionClassNames);
        transitionClassNames && domElement.classList.add(...transitionClassNames[step]);
    }
    // reflow
    domElement.scrollTop;
};
const getDuration = (domElement) => {
    const durationStyleValue = getStyleValue({ domElement, prop: "transition-duration" });
    const durationValue = durationStyleValue !== undefined
        ? styleDurationToMs(durationStyleValue)
        : 0;
    const delayStyleValue = getStyleValue({ domElement, prop: "transition-delay" });
    const delayValue = delayStyleValue !== undefined
        ? styleDurationToMs(delayStyleValue)
        : 0;
    return durationValue + delayValue;
};
const steps = {
    showStart: {
        nextStep: "showEnd"
    },
    showEnd: {
        nextStep: undefined
    },
    hideStart: {
        nextStep: "hideEnd"
    },
    hideEnd: {
        nextStep: undefined
    },
};
const transition = (props, mode) => {
    const domElement = props.domElement;
    if (!domElement) {
        return Promise.resolve("no domElement");
    }
    let currentStep = mode === MODE.SHOW
        ? "showStart"
        : "hideStart";
    return new Promise(resolve => {
        applyStylesForState(domElement, props, currentStep, currentStep === "showStart");
        setTimeout(() => {
            const nextStep = steps[currentStep].nextStep;
            if (nextStep) {
                currentStep = nextStep;
                applyStylesForState(domElement, props, currentStep);
                // addEventListener sometimes hangs this function because it never finishes
                // Using setTimeout instead of addEventListener gives more consistent results
                const duration = getDuration(domElement);
                setTimeout(resolve, duration);
            }
        }, 0);
    });
};
const styleDurationToMs = (durationStr) => {
    const parsed = parseFloat(durationStr) * (durationStr.indexOf("ms") === -1 ? 1000 : 1);
    return isNaN(parsed)
        ? 0
        : parsed;
};

const findItem = (id, items) => {
    return items.find(item => item.id === id);
};
const itemIndex = (id, items) => {
    const item = findItem(id, items);
    return items.indexOf(item);
};
const removeItem = (id, items) => {
    const index = itemIndex(id, items);
    if (index !== -1) {
        items.splice(index, 1);
    }
    return items;
};
const createId = (identityOptions, ns) => [ns, identityOptions.id, identityOptions.spawn].filter(Boolean).join("-");
const store = {
    initialState: {
        store: {},
    },
    actions: (update) => {
        return {
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
                update((state) => {
                    return {
                        ...state,
                    };
                });
            },
        };
    },
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
                const item = items.find((item) => item.id === id);
                return item
                    ? { just: item }
                    : { nothing: undefined };
            },
            getAll: (ns, identityOptions) => {
                const state = states();
                const items = state.store[ns] || [];
                const spawn = identityOptions !== undefined
                    ? identityOptions.spawn
                    : undefined;
                const id = identityOptions !== undefined
                    ? identityOptions.id
                    : undefined;
                const itemsBySpawn = spawn !== undefined
                    ? items.filter(item => item.identityOptions.spawn === spawn)
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
const states = Stream.scan((state, patch) => patch(state), {
    ...store.initialState,
}, update);
const actions = {
    ...store.actions(update),
};
const selectors = {
    ...store.selectors(states),
};
// states.map(state => 
//   console.log(JSON.stringify(state, null, 2))
// );

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
    return {
        timeoutFn,
        promise: new Promise((resolve, reject) => {
            state.onDone = () => resolve();
            state.onAbort = () => resolve();
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
const appendStopTimeout = (state) => {
    window.clearTimeout(state.timerId);
    return {
        timerId: initialState.timerId
    };
};
const appendStopTimer = (state) => {
    return {
        ...appendStopTimeout(state),
    };
};
const appendPauseTimer = (state) => {
    return {
        ...appendStopTimeout(state),
        isPaused: true,
        remaining: getRemaining(state)
    };
};
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
const getRemaining = (state) => (state.remaining === 0 || state.remaining === undefined)
    ? state.remaining
    : state.remaining - (new Date().getTime() - (state.startTime || 0));
const Timer = () => {
    const timer = {
        initialState,
        actions: (update) => {
            return {
                start: (callback, duration) => {
                    update((state) => {
                        return {
                            ...state,
                            ...appendStopTimeout(state),
                            ...appendStartTimer(state, callback, duration, () => timer.actions(update).done()),
                            ...(state.isPaused && appendPauseTimer(state)),
                        };
                    });
                },
                stop: () => {
                    update((state) => {
                        return {
                            ...state,
                            ...appendStopTimer(state),
                            ...initialState
                        };
                    });
                },
                pause: () => {
                    update((state) => {
                        return {
                            ...state,
                            ...(!state.isPaused && appendPauseTimer(state)),
                        };
                    });
                },
                resume: (minimumDuration) => {
                    update((state) => {
                        return {
                            ...state,
                            ...(state.isPaused && appendResumeTimer(state, minimumDuration))
                        };
                    });
                },
                abort: () => {
                    update((state) => {
                        state.onAbort();
                        return {
                            ...state,
                            ...appendStopTimeout(state),
                        };
                    });
                },
                done: () => {
                    update((state) => {
                        return initialState;
                    });
                },
                refresh: () => {
                    update((state) => {
                        return {
                            ...state,
                        };
                    });
                },
            };
        },
        selectors: (states) => {
            return {
                isPaused: () => {
                    const state = states();
                    return state.isPaused;
                },
                getRemaining: () => {
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
    const update = Stream();
    const states = Stream.scan((state, patch) => patch(state), {
        ...timer.initialState,
    }, update);
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

let uid = 0;
const getUid = () => uid === Number.MAX_SAFE_INTEGER
    ? 0
    : uid++;
const transitionStates = {
    default: 0,
    displaying: 1,
    hiding: 2,
};
const getMaybeItem = (ns) => (defaultDialogicOptions) => (identityOptions) => selectors.find(ns, getMergedIdentityOptions(defaultDialogicOptions, identityOptions));
const filterBySpawn = (identityOptions) => (items) => identityOptions.spawn !== undefined
    ? items.filter(item => (item.identityOptions.spawn === identityOptions.spawn))
    : items;
const filterById = (identityOptions) => (items) => identityOptions.id !== undefined
    ? items.filter(item => (item.identityOptions.id === identityOptions.id))
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
        queueCount: item.dialogicOptions.queued
            ? queuedCount++
            : 0
    }))
        .filter(({ queueCount }) => queueCount === 0)
        .map(({ item }) => item);
};
const filterCandidates = (ns, items, identityOptions) => {
    const nsItems = items[ns] || [];
    if (nsItems.length == 0) {
        return [];
    }
    return pipe(filterBySpawn(identityOptions), filterFirstInQueue)(nsItems);
};
const getPassThroughOptions = options => {
    const copy = {
        ...options,
    };
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
        spawn: options.dialogic ? options.dialogic.spawn : undefined
    };
    const mergedIdentityOptions = getMergedIdentityOptions(defaultDialogicOptions || {}, identityOptions);
    const dialogicOptions = {
        ...defaultDialogicOptions,
        ...options.dialogic
    };
    const passThroughOptions = getPassThroughOptions(options);
    return {
        identityOptions: mergedIdentityOptions,
        dialogicOptions,
        passThroughOptions,
    };
};
const createInstance = (ns) => (defaultDialogicOptions) => (options = {}) => {
    const { identityOptions, dialogicOptions, passThroughOptions } = handleOptions(defaultDialogicOptions, options);
    return new Promise(resolve => {
        const callbacks = {
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
            }
        };
        const item = {
            ns,
            identityOptions,
            dialogicOptions,
            callbacks,
            passThroughOptions,
            id: createId(identityOptions, ns),
            timer: dialogicOptions.timeout
                ? Timer()
                : undefined,
            key: getUid().toString(),
            transitionState: transitionStates.default,
        };
        const maybeExistingItem = selectors.find(ns, identityOptions);
        if (maybeExistingItem.just && dialogicOptions.toggle) {
            const hideResult = hide(ns)(defaultDialogicOptions)(options);
            return resolve(hideResult);
        }
        if (maybeExistingItem.just && !dialogicOptions.queued) {
            const existingItem = maybeExistingItem.just;
            // Preserve dialogicOptions
            const dialogicOptions = existingItem.dialogicOptions;
            const replacingItem = {
                ...item,
                transitionState: existingItem.transitionState,
                dialogicOptions
            };
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
    const { identityOptions, dialogicOptions, passThroughOptions } = handleOptions(defaultDialogicOptions, options);
    const maybeExistingItem = selectors.find(ns, identityOptions);
    if (maybeExistingItem.just) {
        const existingItem = maybeExistingItem.just;
        const item = {
            ...existingItem,
            dialogicOptions: {
                ...existingItem.dialogicOptions,
                ...dialogicOptions,
            },
            passThroughOptions: {
                ...existingItem.passThroughOptions,
                passThroughOptions
            }
        };
        actions.replace(ns, existingItem.id, item);
        if (item.transitionState !== transitionStates.hiding) {
            return hideItem(item);
        }
        else {
            return Promise.resolve(item);
        }
    }
    return Promise.resolve();
};
const pause = (ns) => (defaultDialogicOptions) => (identityOptions) => {
    const items = getValidItems(ns, identityOptions)
        .filter(item => !!item.timer);
    items.forEach((item) => item.timer && item.timer.actions.pause());
    return Promise.all(items);
};
const resume = (ns) => (defaultDialogicOptions) => (commandOptions) => {
    const options = commandOptions || {};
    const identityOptions = {
        id: options.id,
        spawn: options.spawn
    };
    const items = getValidItems(ns, identityOptions)
        .filter(item => !!item.timer);
    items.forEach((item) => item.timer && item.timer.actions.resume(options.minimumDuration));
    return Promise.all(items);
};
const getTimerProperty = (timerProp, defaultValue) => (ns) => (defaultDialogicOptions) => (identityOptions) => {
    const maybeItem = getMaybeItem(ns)(defaultDialogicOptions)(identityOptions);
    if (maybeItem.just) {
        if (maybeItem.just && maybeItem.just.timer) {
            return maybeItem.just.timer.selectors[timerProp]();
        }
        else {
            return defaultValue;
        }
    }
    else {
        return defaultValue;
    }
};
const isPaused = getTimerProperty("isPaused", false);
const getRemaining$1 = getTimerProperty("getRemaining", undefined);
const exists = (ns) => (defaultDialogicOptions) => (identityOptions) => !!getValidItems(ns, identityOptions).length;
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
const resetAll = (ns) => (defaultDialogicOptions) => (identityOptions) => {
    const validItems = getValidItems(ns, identityOptions);
    const items = [];
    validItems.forEach((item) => {
        item.timer && item.timer.actions.abort();
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
const getOverridingTransitionOptions = (item, dialogicOptions) => {
    return {
        ...item,
        dialogicOptions: {
            ...item.dialogicOptions,
            ...dialogicOptions
        }
    };
};
/**
 * Triggers a `hideItem` for each item in the store.
 * Queued items: will trigger `hideItem` only for the first item, then reset the store.
 * Optional `dialogicOptions` may be passed with specific transition options. This comes in handy when all items should hide in the same way.
 */
const hideAll = (ns) => (defaultDialogicOptions) => (dialogicOptions) => {
    const options = dialogicOptions || {};
    const identityOptions = {
        id: options.id,
        spawn: options.spawn
    };
    const validItems = getValidItems(ns, identityOptions);
    const regularItems = validItems.filter((item) => !options.queued && !item.dialogicOptions.queued);
    const queuedItems = validItems.filter((item) => options.queued || item.dialogicOptions.queued);
    const items = [];
    regularItems.forEach((item) => items.push(hideItem(getOverridingTransitionOptions(item, options))));
    if (queuedItems.length > 0) {
        const [current,] = queuedItems;
        // Make sure that any remaining items don't suddenly appear
        actions.store(ns, [current]);
        // Transition the current item
        items.push(hideItem(getOverridingTransitionOptions(current, options)));
    }
    return Promise.all(items);
};
const getCount = (ns) => (identityOptions) => selectors.getCount(ns, identityOptions);
const transitionItem = (item, mode) => transition(item.dialogicOptions, mode);
const deferredHideItem = async function (item, timer, timeout) {
    timer.actions.start(() => (hideItem(item)), timeout);
    return getTimerProperty("getResultPromise", undefined);
};
const showItem = async function (item) {
    if (item.transitionState !== transitionStates.displaying) {
        item.transitionState = transitionStates.displaying;
        await (transitionItem(item, MODE.SHOW));
    }
    item.callbacks.didShow && await (item.callbacks.didShow(item));
    if (item.dialogicOptions.timeout && item.timer) {
        await (deferredHideItem(item, item.timer, item.dialogicOptions.timeout));
    }
    return Promise.resolve(item);
};
const hideItem = async function (item) {
    item.transitionState = transitionStates.hiding;
    // Stop any running timer
    if (item.timer) {
        item.timer.actions.stop();
    }
    await (transitionItem(item, MODE.HIDE));
    item.callbacks.didHide && await (item.callbacks.didHide(item));
    const copy = {
        ...item
    };
    actions.remove(item.ns, item.id);
    return Promise.resolve(copy);
};
const setDomElement = (domElement, item) => {
    item.dialogicOptions.domElement = domElement;
};

const dialogical = ({ ns, queued, timeout }) => {
    const defaultId = `default_${ns}`;
    const defaultSpawn = `default_${ns}`;
    const defaultDialogicOptions = {
        id: defaultId,
        spawn: defaultSpawn,
        ...(queued && { queued }),
        ...(timeout !== undefined && { timeout }),
    };
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
        getRemaining: getRemaining$1(ns)(defaultDialogicOptions),
    };
};

const dialog = dialogical({ ns: "dialog" });

const notification = dialogical({ ns: "notification", queued: true, timeout: 3000 });

/**
 * Utility script that uses an animation frame to pass the current remaining value
 * (which is utilized when setting `timeout`).
 */
const remaining = (props) => {
    let displayValue = undefined;
    let reqId;
    let isCanceled = false;
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
        }
        else if (!isCanceled) {
            reqId = window.requestAnimationFrame(update);
        }
    };
    reqId = window.requestAnimationFrame(update);
};

export { actions, dialog, dialogical, exists, filterCandidates, getCount, getRemaining$1 as getRemaining, getTimerProperty, hide, hideAll, hideItem, isPaused, notification, pause, remaining, resetAll, resume, selectors, setDomElement, show, showItem, states };
