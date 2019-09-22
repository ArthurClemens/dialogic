import React, { useRef, useCallback, useEffect, useState } from 'react';

const pipe = (...fns) => (x) => fns.filter(Boolean).reduce((y, f) => f(y), x);
const getStyleValue = ({ domElement, prop }) => {
    if (window.getComputedStyle) {
        const defaultView = document.defaultView;
        if (defaultView) {
            const style = defaultView.getComputedStyle(domElement);
            if (style) {
                return style.getPropertyValue(prop);
            }
        }
    }
    return undefined;
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

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var stream = createCommonjsModule(function (module) {
(function() {
/* eslint-enable */
Stream.SKIP = {};
Stream.lift = lift;
Stream.scan = scan;
Stream.merge = merge;
Stream.combine = combine;
Stream.scanMerge = scanMerge;
Stream["fantasy-land/of"] = Stream;

var warnedHalt = false;
Object.defineProperty(Stream, "HALT", {
	get: function() {
		warnedHalt || console.log("HALT is deprecated and has been renamed to SKIP");
		warnedHalt = true;
		return Stream.SKIP
	}
});

function Stream(value) {
	var dependentStreams = [];
	var dependentFns = [];

	function stream(v) {
		if (arguments.length && v !== Stream.SKIP) {
			value = v;
			if (open(stream)) {
				stream._changing();
				stream._state = "active";
				dependentStreams.forEach(function(s, i) { s(dependentFns[i](value)); });
			}
		}

		return value
	}

	stream.constructor = Stream;
	stream._state = arguments.length && value !== Stream.SKIP ? "active" : "pending";
	stream._parents = [];

	stream._changing = function() {
		if (open(stream)) stream._state = "changing";
		dependentStreams.forEach(function(s) {
			s._changing();
		});
	};

	stream._map = function(fn, ignoreInitial) {
		var target = ignoreInitial ? Stream() : Stream(fn(value));
		target._parents.push(stream);
		dependentStreams.push(target);
		dependentFns.push(fn);
		return target
	};

	stream.map = function(fn) {
		return stream._map(fn, stream._state !== "active")
	};

	var end;
	function createEnd() {
		end = Stream();
		end.map(function(value) {
			if (value === true) {
				stream._parents.forEach(function (p) {p._unregisterChild(stream);});
				stream._state = "ended";
				stream._parents.length = dependentStreams.length = dependentFns.length = 0;
			}
			return value
		});
		return end
	}

	stream.toJSON = function() { return value != null && typeof value.toJSON === "function" ? value.toJSON() : value };

	stream["fantasy-land/map"] = stream.map;
	stream["fantasy-land/ap"] = function(x) { return combine(function(s1, s2) { return s1()(s2()) }, [x, stream]) };

	stream._unregisterChild = function(child) {
		var childIndex = dependentStreams.indexOf(child);
		if (childIndex !== -1) {
			dependentStreams.splice(childIndex, 1);
			dependentFns.splice(childIndex, 1);
		}
	};

	Object.defineProperty(stream, "end", {
		get: function() { return end || createEnd() }
	});

	return stream
}

function combine(fn, streams) {
	var ready = streams.every(function(s) {
		if (s.constructor !== Stream)
			throw new Error("Ensure that each item passed to stream.combine/stream.merge/lift is a stream")
		return s._state === "active"
	});
	var stream = ready
		? Stream(fn.apply(null, streams.concat([streams])))
		: Stream();

	var changed = [];

	var mappers = streams.map(function(s) {
		return s._map(function(value) {
			changed.push(s);
			if (ready || streams.every(function(s) { return s._state !== "pending" })) {
				ready = true;
				stream(fn.apply(null, streams.concat([changed])));
				changed = [];
			}
			return value
		}, true)
	});

	var endStream = stream.end.map(function(value) {
		if (value === true) {
			mappers.forEach(function(mapper) { mapper.end(true); });
			endStream.end(true);
		}
		return undefined
	});

	return stream
}

function merge(streams) {
	return combine(function() { return streams.map(function(s) { return s() }) }, streams)
}

function scan(fn, acc, origin) {
	var stream = origin.map(function(v) {
		var next = fn(acc, v);
		if (next !== Stream.SKIP) acc = next;
		return next
	});
	stream(acc);
	return stream
}

function scanMerge(tuples, seed) {
	var streams = tuples.map(function(tuple) { return tuple[0] });

	var stream = combine(function() {
		var changed = arguments[arguments.length - 1];
		streams.forEach(function(stream, i) {
			if (changed.indexOf(stream) > -1)
				seed = tuples[i][1](seed, stream());
		});

		return seed
	}, streams);

	stream(seed);

	return stream
}

function lift() {
	var fn = arguments[0];
	var streams = Array.prototype.slice.call(arguments, 1);
	return merge(streams).map(function(streams) {
		return fn.apply(undefined, streams)
	})
}

function open(s) {
	return s._state === "pending" || s._state === "active" || s._state === "changing"
}

module["exports"] = Stream;

}());
});

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
const update = stream();
const states = stream.scan((state, patch) => patch(state), {
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
    isPaused: undefined,
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
const getRemaining = (state) => state.remaining === undefined
    ? undefined
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
    const update = stream();
    const states = stream.scan((state, patch) => patch(state), {
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
const performOnItem = fn => ns => defaultDialogicOptions => (options) => {
    const maybeItem = getMaybeItem(ns)(defaultDialogicOptions)(options);
    if (maybeItem.just) {
        return fn(ns, maybeItem.just, options);
    }
    else {
        return Promise.resolve();
    }
};
const getMaybeItem = (ns) => (defaultDialogicOptions) => (identityOptions) => selectors.find(ns, getMergedIdentityOptions(defaultDialogicOptions, identityOptions));
const filterBySpawn = (identityOptions) => (items) => (items.filter(item => (item.identityOptions.spawn === identityOptions.spawn)));
const filterById = (identityOptions) => (items) => (items.filter(item => (item.identityOptions.id === identityOptions.id)));
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
const createInstance = (ns) => (defaultDialogicOptions) => (options = {}) => {
    return new Promise(resolve => {
        const identityOptions = {
            id: options.dialogic ? options.dialogic.id : undefined,
            spawn: options.dialogic ? options.dialogic.spawn : undefined
        };
        const mergedIdentityOptions = getMergedIdentityOptions(defaultDialogicOptions, identityOptions);
        const dialogicOptions = {
            ...defaultDialogicOptions,
            ...options.dialogic
        };
        const passThroughOptions = getPassThroughOptions(options);
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
            identityOptions: mergedIdentityOptions,
            dialogicOptions,
            callbacks,
            passThroughOptions,
            id: createId(mergedIdentityOptions, ns),
            timer: dialogicOptions.timeout
                ? Timer()
                : undefined,
            key: getUid().toString(),
            transitionState: transitionStates.default,
        };
        const maybeExistingItem = selectors.find(ns, mergedIdentityOptions);
        if (maybeExistingItem.just && dialogicOptions.toggle) {
            const hideResult = hide(ns)(defaultDialogicOptions)(identityOptions);
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
const hide = performOnItem((ns, item) => {
    if (item.transitionState !== transitionStates.hiding) {
        return hideItem(item);
    }
    else {
        return Promise.resolve(item);
    }
});
const pause = performOnItem((ns, item) => {
    if (item && item.timer) {
        item.timer.actions.pause();
    }
    return Promise.resolve(item);
});
const resume = performOnItem((ns, item, commandOptions = {}) => {
    if (item && item.timer) {
        item.timer.actions.resume(commandOptions.minimumDuration);
    }
    return Promise.resolve(item);
});
const getTimerProperty = (timerProp) => (ns) => (defaultDialogicOptions) => (identityOptions) => {
    const maybeItem = getMaybeItem(ns)(defaultDialogicOptions)(identityOptions);
    if (maybeItem.just) {
        if (maybeItem.just && maybeItem.just.timer) {
            return maybeItem.just.timer.selectors[timerProp]();
        }
        else {
            return undefined;
        }
    }
    else {
        return undefined;
    }
};
const isPaused = getTimerProperty("isPaused");
const getRemaining$1 = getTimerProperty("getRemaining");
const exists = (ns) => (defaultDialogicOptions) => (identityOptions) => {
    const maybeItem = getMaybeItem(ns)(defaultDialogicOptions)(identityOptions);
    return !!maybeItem.just;
};
const getValidItems = (ns, defaultDialogicOptions, dialogicOptions) => {
    const allItems = selectors.getAll(ns);
    let validItems;
    if (dialogicOptions) {
        const combinedOptions = {
            ...defaultDialogicOptions,
            ...dialogicOptions,
        };
        validItems = pipe(filterBySpawn(combinedOptions), filterById(combinedOptions))(allItems);
    }
    else {
        validItems = allItems;
    }
    return validItems;
};
const resetAll = (ns) => (defaultDialogicOptions) => (dialogicOptions) => {
    const validItems = getValidItems(ns, defaultDialogicOptions, dialogicOptions);
    const items = [];
    validItems.forEach((item) => {
        item.timer && item.timer.actions.abort();
        items.push(item);
    });
    if (dialogicOptions) {
        validItems.forEach((item) => {
            actions.remove(ns, item.id);
        });
    }
    else {
        actions.removeAll(ns);
    }
    return Promise.resolve(items);
};
const getOverridingTransitionOptions = (item, options) => {
    return {
        ...item,
        dialogicOptions: {
            ...item.dialogicOptions,
            ...options
        }
    };
};
/**
 * Triggers a `hideItem` for each item in the store.
 * Queued items: will trigger `hideItem` only for the first item, then reset the store.
 * `dialogicOptions` may contain specific transition options. This comes in handy when all items should hide in the same manner.
 * */
const hideAll = (ns) => (defaultDialogicOptions) => (dialogicOptions) => {
    const validItems = getValidItems(ns, defaultDialogicOptions, dialogicOptions);
    const options = dialogicOptions || {};
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
const transitionItem = (item, mode) => {
    return transition(item.dialogicOptions, mode);
};
const deferredHideItem = async function (item, timer, timeout) {
    timer.actions.start(() => (hideItem(item)), timeout);
    return getTimerProperty("getResultPromise");
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

const handleDispatch = (ns) => (event, fn) => {
    // Update dispatching item:
    const maybeItem = selectors.find(ns, event.detail.identityOptions);
    if (maybeItem.just) {
        setDomElement(event.detail.domElement, maybeItem.just);
    }
    // Find item to transition:
    const maybeTransitioningItem = selectors.find(ns, event.detail.identityOptions);
    if (maybeTransitioningItem.just) {
        fn(maybeTransitioningItem.just);
    }
};
const onInstanceMounted = (ns) => (event) => handleDispatch(ns)(event, showItem);
const onShowInstance = (ns) => (event) => handleDispatch(ns)(event, showItem);
const onHideInstance = (ns) => (event) => handleDispatch(ns)(event, hideItem);

const Instance = props => {
    const domElementRef = useRef();
    const className = props.dialogicOptions.className;
    const Component = props.dialogicOptions.component;
    const domElementCb = useCallback(node => {
        if (node !== null) {
            domElementRef.current = node;
            onMount();
        }
    }, []);
    const dispatchTransition = (dispatchFn) => {
        const domElement = domElementRef.current;
        if (domElement === undefined) {
            return;
        }
        dispatchFn({
            detail: {
                identityOptions: props.identityOptions,
                domElement
            }
        });
    };
    const onMount = () => {
        dispatchTransition(props.onMount);
    };
    const show = () => {
        dispatchTransition(props.onShow);
    };
    const hide = () => {
        dispatchTransition(props.onHide);
    };
    return (React.createElement("div", { ref: domElementCb, className: className },
        React.createElement(Component, Object.assign({}, props.passThroughOptions, { show: show, hide: hide }))));
};

const Wrapper = props => {
    const nsOnInstanceMounted = onInstanceMounted(props.ns);
    const nsOnShowInstance = onShowInstance(props.ns);
    const nsOnHideInstance = onHideInstance(props.ns);
    const identityOptions = props.identityOptions || {};
    const filtered = filterCandidates(props.ns, selectors.getStore(), identityOptions);
    return (React.createElement(React.Fragment, null, filtered.map(item => React.createElement(Instance, { key: item.key, identityOptions: item.identityOptions, dialogicOptions: item.dialogicOptions, passThroughOptions: item.passThroughOptions, onMount: nsOnInstanceMounted, onShow: nsOnShowInstance, onHide: nsOnHideInstance }))));
};

const useAnimationFrame = (callback) => {
    const requestRef = useRef();
    const previousTimeRef = useRef();
    const animate = (time) => {
        if (previousTimeRef.current !== undefined) {
            const deltaTime = time - previousTimeRef.current;
            callback(deltaTime);
        }
        previousTimeRef.current = time;
        requestRef.current = requestAnimationFrame(animate);
    };
    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => {
            const id = requestRef.current;
            if (id !== undefined) {
                cancelAnimationFrame(id);
            }
        };
    }, []);
};

const Dialogical = type => props => {
    const [, setUpdateCount] = useState(0);
    const identityOptions = {
        id: props.id || type.defaultId,
        spawn: props.spawn || type.defaultSpawn,
    };
    // Mount
    useEffect(() => {
        if (typeof props.onMount === "function") {
            props.onMount();
        }
    }, []);
    // Use animation frame to create redraws without hitting "Can't perform a React state update on an unmounted component."
    useAnimationFrame((deltaTime) => {
        setUpdateCount(prevCount => (prevCount + deltaTime * 0.01) % 100);
    });
    return React.createElement(Wrapper, { identityOptions: identityOptions, ns: type.ns });
};

const useDialogic = () => {
    const [store, setStore] = useState({});
    useEffect(() => {
        states.map(({ store }) => {
            setStore({
                ...store
            });
        });
    }, []);
    return [
        store
    ];
};

const Dialog = Dialogical(dialog);
const Notification = Dialogical(notification);

export { Dialog, Dialogical, Notification, dialog, notification, useDialogic };
