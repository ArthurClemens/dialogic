import m from 'mithril';

const isClient = typeof document !== "undefined";
const pipe = (...fns) => (x) => fns.filter(Boolean).reduce((y, f) => f(y), x);

const MODE = {
    SHOW: "show",
    HIDE: "hide"
};
const transitionOptionKeys = {
    className: true,
    component: true,
    didHide: true,
    didShow: true,
    hideDelay: true,
    hideDuration: true,
    hideTimingFunction: true,
    showClassName: true,
    showDelay: true,
    showDuration: true,
    showTimingFunction: true,
    timeout: true,
    transitionClassName: true,
    transitions: true,
};
const transition = (props, mode) => {
    const domElement = props.domElements
        ? props.domElements.domElement
        : null;
    if (!domElement) {
        throw new Error("No DOM element");
    }
    return new Promise(resolve => {
        const style = domElement.style;
        const computedStyle = isClient
            ? window.getComputedStyle(domElement)
            : null;
        const isShow = mode === MODE.SHOW;
        const transitionProps = getTransitionProps(props, isShow);
        const duration = transitionProps.duration !== undefined
            ? transitionProps.duration * 1000
            : computedStyle
                ? styleDurationToMs(computedStyle.transitionDuration)
                : 0;
        const delay = transitionProps.delay !== undefined
            ? transitionProps.delay * 1000
            : computedStyle
                ? styleDurationToMs(computedStyle.transitionDelay)
                : 0;
        const totalDuration = duration + delay;
        const before = () => {
            if (transitionProps.before && typeof transitionProps.before === "function") {
                style.transitionDuration = "0ms";
                style.transitionDelay = "0ms";
                transitionProps.before();
            }
        };
        const after = () => {
            if (transitionProps.after && typeof transitionProps.after === "function") {
                transitionProps.after();
            }
        };
        const applyTransition = () => {
            // Set styles
            const timingFunction = transitionProps.timingFunction
                // or when set in CSS:
                || (computedStyle
                    ? computedStyle.transitionTimingFunction
                    : undefined);
            if (timingFunction) {
                style.transitionTimingFunction = timingFunction;
            }
            style.transitionDuration = duration + "ms";
            style.transitionDelay = delay + "ms";
            // Set classes (need to be set after styles)
            if (props.transitionClassName) {
                domElement.classList.add(props.transitionClassName);
            }
            if (props.showClassName) {
                const showClassElement = props.showClassElement || domElement;
                showClassElement.classList[isShow ? "add" : "remove"](props.showClassName);
            }
            // Call transition function
            if (transitionProps.transition) {
                transitionProps.transition();
            }
        };
        before();
        applyTransition();
        setTimeout(() => {
            after();
            if (props.transitionClassName) {
                domElement.classList.remove(props.transitionClassName);
            }
            resolve();
        }, totalDuration);
    });
};
const styleDurationToMs = (durationStr) => {
    const parsed = parseFloat(durationStr) * (durationStr.indexOf("ms") === -1 ? 1000 : 1);
    return isNaN(parsed)
        ? 0
        : parsed;
};
const getTransitionProps = (props, isShow) => {
    const [duration, delay, timingFunction, transition] = isShow
        ? [props.showDuration, props.showDelay, props.showTimingFunction, props.transitions ? props.transitions.show : undefined]
        : [props.hideDuration, props.hideDelay, props.hideTimingFunction, props.transitions ? props.transitions.hide : undefined];
    return {
        duration,
        delay,
        timingFunction,
        ...(transition
            ? transition(props.domElements)
            : undefined)
    };
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
const createId = (spawnOptions, ns) => [ns, spawnOptions.id, spawnOptions.spawn].filter(Boolean).join("-");
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
            find: (ns, spawnOptions) => {
                const state = states();
                const items = state.store[ns] || [];
                const id = createId(spawnOptions, ns);
                const item = items.find((item) => item.id === id);
                return item
                    ? { just: item }
                    : { nothing: undefined };
            },
            getAll: (ns, instanceSpawnOptions) => {
                const state = states();
                const items = state.store[ns] || [];
                const spawn = instanceSpawnOptions !== undefined
                    ? instanceSpawnOptions.spawn
                    : undefined;
                const id = instanceSpawnOptions !== undefined
                    ? instanceSpawnOptions.id
                    : undefined;
                const itemsBySpawn = spawn !== undefined
                    ? items.filter(item => item.spawnOptions.spawn === spawn)
                    : items;
                const itemsById = id !== undefined
                    ? itemsBySpawn.filter(item => item.spawnOptions.id === id)
                    : itemsBySpawn;
                return itemsById;
            },
            getCount: (ns, instanceSpawnOptions) => fns.getAll(ns, instanceSpawnOptions).length,
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
    timerId: undefined,
    isPaused: undefined,
    remaining: undefined,
    startTime: undefined,
    callback: () => { },
    timeoutFn: () => { },
    promise: undefined,
    onDone: () => { },
    onAbort: () => { },
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
                            ...appendPauseTimer(state),
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
    none: "none",
    hiding: "hiding"
};
const filterBySpawnOption = (spawnOptions) => (nsItems) => nsItems.filter(item => item.spawnOptions.spawn === spawnOptions.spawn);
/**
 * Gets a list of all non-queued items.
 * From the queued items only the first item is listed.
 * */
const filterFirstInQueue = (nsItems) => {
    let queuedCount = 0;
    return nsItems
        .map(item => ({
        item,
        queueCount: item.spawnOptions.queued
            ? queuedCount++
            : 0
    }))
        .filter(({ queueCount }) => queueCount === 0)
        .map(({ item }) => item);
};
const filterCandidates = (ns, items, spawnOptions) => {
    const nsItems = items[ns] || [];
    return pipe(filterFirstInQueue, filterBySpawnOption(spawnOptions))(nsItems);
};
const getOptionsByKind = options => {
    const initial = {
        transitionOptions: {},
        instanceOptions: {}
    };
    return Object.keys(options).reduce((acc, key) => {
        const value = options[key];
        const isTransitionKey = transitionOptionKeys[key];
        if (isTransitionKey) {
            acc.transitionOptions[key] = value;
        }
        else {
            acc.instanceOptions[key] = value;
        }
        return acc;
    }, initial);
};
const createInstance = (ns) => (defaultSpawnOptions) => (defaultTransitionOptions) => (options, instanceSpawnOptions) => {
    return new Promise((resolve) => {
        const spawnOptions = {
            ...defaultSpawnOptions,
            ...instanceSpawnOptions,
        };
        const id = createId(spawnOptions, ns);
        const { transitionOptions: instanceTransitionOptions, instanceOptions } = getOptionsByKind(options);
        const transitionOptions = {
            ...defaultTransitionOptions,
            ...instanceTransitionOptions,
        };
        transitionOptions.didShow = (id) => {
            if (options.didShow) {
                options.didShow(id);
            }
            return resolve(id);
        };
        transitionOptions.didHide = (id) => {
            if (options.didHide) {
                options.didHide(id);
            }
            return resolve(id);
        };
        const uid = getUid().toString();
        const item = {
            spawnOptions,
            transitionOptions,
            instanceTransitionOptions,
            instanceOptions,
            id,
            timer: transitionOptions.timeout
                ? Timer()
                : undefined,
            key: uid,
            transitionState: transitionStates.none,
        };
        const maybeExistingItem = selectors.find(ns, spawnOptions);
        if (maybeExistingItem.just && !spawnOptions.queued) {
            const existingItem = maybeExistingItem.just;
            // Preserve instanceTransitionOptions
            const instanceTransitionOptions = existingItem.instanceTransitionOptions;
            const replacingItem = {
                ...item,
                instanceTransitionOptions
            };
            actions.replace(ns, existingItem.id, replacingItem);
            // While this is a replace action, mimic a show
            transitionOptions.didShow(spawnOptions.id);
        }
        else {
            actions.add(ns, item);
            // This will instantiate and draw the instance
            // The instance will call `showDialog` in `onMount`
        }
    });
};
const show = createInstance;
const getMaybeItem = (ns) => (defaultSpawnOptions) => (instanceSpawnOptions) => {
    const spawnOptions = {
        ...defaultSpawnOptions,
        ...instanceSpawnOptions,
    };
    return selectors.find(ns, spawnOptions);
};
const performOnItem = fn => ns => defaultSpawnOptions => (instanceSpawnOptions, fnOptions) => {
    const maybeItem = getMaybeItem(ns)(defaultSpawnOptions)(instanceSpawnOptions);
    if (maybeItem.just) {
        return fn(ns, maybeItem.just, fnOptions);
    }
    else {
        return Promise.resolve();
    }
};
const hide = performOnItem((ns, item) => {
    if (item.transitionState !== transitionStates.hiding) {
        item.transitionState = transitionStates.hiding;
        return hideItem(ns, item);
    }
    else {
        return Promise.resolve();
    }
});
const pause = performOnItem((ns, item) => {
    if (item && item.timer) {
        item.timer.actions.pause();
    }
    return Promise.resolve();
});
const resume = performOnItem((ns, item, fnOptions = {}) => {
    if (item && item.timer) {
        item.timer.actions.resume(fnOptions.minimumDuration);
    }
    return Promise.resolve();
});
const getTimerProperty = (timerProp) => (ns) => (defaultSpawnOptions) => (instanceSpawnOptions) => {
    const maybeItem = getMaybeItem(ns)(defaultSpawnOptions)(instanceSpawnOptions);
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
const isDisplayed = (ns) => (defaultSpawnOptions) => (instanceSpawnOptions) => {
    const maybeItem = getMaybeItem(ns)(defaultSpawnOptions)(instanceSpawnOptions);
    return !!maybeItem.just;
};
const resetAll = (ns) => () => {
    selectors.getAll(ns).forEach((item) => item.timer && item.timer.actions.abort());
    actions.removeAll(ns);
    return Promise.resolve();
};
const getOverridingTransitionOptions = (item, options) => {
    const { transitionOptions } = getOptionsByKind(options);
    return {
        ...item,
        transitionOptions: {
            ...item.transitionOptions,
            ...transitionOptions
        }
    };
};
/**
 * Triggers a `hideItem` for each item in the store.
 * Queued items: will trigger `hideItem` only for the first item, then reset the store.
 * `options` may contain specific transition options. This comes in handy when all items should hide in the same manner.
 * */
const hideAll = (ns) => (defaultSpawnOptions) => (options, instanceSpawnOptions) => {
    const spawnOptions = {
        ...defaultSpawnOptions,
        ...instanceSpawnOptions,
    };
    const allItems = selectors.getAll(ns);
    const regularItems = allItems.filter((item) => !spawnOptions.queued && !item.spawnOptions.queued);
    const queuedItems = allItems.filter((item) => spawnOptions.queued || item.spawnOptions.queued);
    regularItems.forEach((item) => hideItem(ns, getOverridingTransitionOptions(item, options)));
    if (queuedItems.length > 0) {
        const [current,] = queuedItems;
        // Make sure that any remaining items don't suddenly appear
        actions.store(ns, [current]);
        // Transition the current item
        hideItem(ns, getOverridingTransitionOptions(current, options))
            .then(() => actions.removeAll(ns));
    }
};
const getCount = (ns) => (instanceSpawnOptions) => selectors.getCount(ns, instanceSpawnOptions);
const transitionItem = (item, mode) => {
    try {
        return transition({
            ...item.instanceTransitionOptions,
            ...item.transitionOptions,
        }, mode);
    }
    catch (e) {
        throw new Error(`Transition error: ${e}`);
    }
};
const deferredHideItem = async function (ns, item, timer, timeout) {
    timer.actions.start(() => (hideItem(ns, item)), timeout);
    return getTimerProperty("getResultPromise"); // timer.selectors.getResultPromise();
};
const showItem = async function (ns, item) {
    await (transitionItem(item, MODE.SHOW));
    item.transitionOptions.didShow && await (item.transitionOptions.didShow(item.spawnOptions.id));
    if (item.transitionOptions.timeout && item.timer) {
        await (deferredHideItem(ns, item, item.timer, item.transitionOptions.timeout));
    }
    return item.spawnOptions.id;
};
const hideItem = async function (ns, item) {
    // Stop any running timer
    if (item.timer) {
        item.timer.actions.stop();
    }
    await (transitionItem(item, MODE.HIDE));
    item.transitionOptions.didHide && await (item.transitionOptions.didHide(item.spawnOptions.id));
    actions.remove(ns, item.id);
    return item.spawnOptions.id;
};

const dialogical = ({ ns, queued, timeout }) => {
    const defaultId = `default_${ns}`;
    const defaultSpawn = `default_${ns}`;
    const defaultSpawnOptions = {
        id: defaultId,
        spawn: defaultSpawn,
        queued
    };
    const defaultTransitionOptions = {
        timeout
    };
    return {
        // Identification
        ns,
        defaultId,
        defaultSpawn,
        // Configuration
        defaultSpawnOptions,
        // Commands
        show: show(ns)(defaultSpawnOptions)(defaultTransitionOptions),
        hide: hide(ns)(defaultSpawnOptions),
        pause: pause(ns)(defaultSpawnOptions),
        resume: resume(ns)(defaultSpawnOptions),
        hideAll: hideAll(ns)(defaultSpawnOptions),
        resetAll: resetAll(ns),
        // State
        isDisplayed: isDisplayed(ns)(defaultSpawnOptions),
        getCount: getCount(ns),
        // Timer state
        isPaused: isPaused(ns)(defaultSpawnOptions),
        getRemaining: getRemaining$1(ns)(defaultSpawnOptions),
    };
};

const dialog = dialogical({ ns: "dialog" });

const notification = dialogical({ ns: "notification", queued: true, timeout: 3000 });

const handleDispatch = (ns) => (event, fn) => {
    // Update dispatching item:
    const maybeItem = selectors.find(ns, event.detail.spawnOptions);
    if (maybeItem.just) {
        maybeItem.just.instanceTransitionOptions = event.detail.transitionOptions;
    }
    // Find item to transition:
    const maybeTransitioningItem = selectors.find(ns, event.detail.spawnOptions);
    if (maybeTransitioningItem.just) {
        fn(ns, maybeTransitioningItem.just);
    }
};
const onInstanceMounted = (ns) => (event) => handleDispatch(ns)(event, showItem);
const onShowInstance = (ns) => (event) => handleDispatch(ns)(event, showItem);
const onHideInstance = (ns) => (event) => handleDispatch(ns)(event, hideItem);

const Instance = ({ attrs }) => {
    let domElement;
    const classNames = [
        attrs.transitionOptions.className,
        attrs.instanceOptions.className
    ].join(" ");
    const dispatchTransition = (dispatchFn) => {
        dispatchFn({
            detail: {
                spawnOptions: attrs.spawnOptions,
                transitionOptions: {
                    className: attrs.transitionOptions.className,
                    showClassName: attrs.transitionOptions.showClassName,
                    domElements: {
                        domElement
                    },
                },
            }
        });
    };
    const onMount = () => {
        dispatchTransition(attrs.onMount);
    };
    const show = () => {
        dispatchTransition(attrs.onShow);
    };
    const hide = () => {
        dispatchTransition(attrs.onHide);
    };
    return {
        oncreate: (vnode) => {
            domElement = vnode.dom;
            onMount();
        },
        view: () => {
            return m("div", {
                className: classNames,
            }, m(attrs.transitionOptions.component, {
                ...attrs.instanceOptions,
                show,
                hide,
            }, [
                m("div", "Instance"),
                m("button", { onclick: () => hide() }, "Hide from instance"),
            ]));
        }
    };
};

const Wrapper = {
    view: ({ attrs }) => {
        const nsOnInstanceMounted = onInstanceMounted(attrs.ns);
        const nsOnShowInstance = onShowInstance(attrs.ns);
        const nsOnHideInstance = onHideInstance(attrs.ns);
        const spawnOptions = attrs.spawnOptions || {};
        const filtered = filterCandidates(attrs.ns, selectors.getStore(), spawnOptions);
        return filtered.map(item => m(Instance, {
            key: item.key,
            spawnOptions: item.spawnOptions,
            transitionOptions: item.transitionOptions,
            instanceOptions: item.instanceOptions,
            onMount: nsOnInstanceMounted,
            onShow: nsOnShowInstance,
            onHide: nsOnHideInstance,
        }));
    }
};

const Dialogical = type => ({
    oncreate: ({ attrs }) => {
        if (typeof attrs.onMount === "function") {
            attrs.onMount();
        }
    },
    view: ({ attrs }) => {
        const spawnOptions = {
            id: attrs.id || type.defaultId,
            spawn: attrs.spawn || type.defaultSpawn,
        };
        return m(Wrapper, {
            spawnOptions,
            ns: type.ns,
        });
    }
});

const Dialog = Dialogical(dialog);
const Notification = Dialogical(notification);
states.map(state => (m.redraw()));

export { Dialog, Notification, dialog, notification };