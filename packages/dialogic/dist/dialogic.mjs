function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var rngBrowser = createCommonjsModule(function (module) {
// Unique ID creation requires a high quality random # generator.  In the
// browser this is a little complicated due to unknown quality of Math.random()
// and inconsistent support for the `crypto` API.  We do the best we can via
// feature-detection

// getRandomValues needs to be invoked in a context where "this" is a Crypto
// implementation. Also, find the complete implementation of crypto on IE11.
var getRandomValues = (typeof(crypto) != 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto)) ||
                      (typeof(msCrypto) != 'undefined' && typeof window.msCrypto.getRandomValues == 'function' && msCrypto.getRandomValues.bind(msCrypto));

if (getRandomValues) {
  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
  var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef

  module.exports = function whatwgRNG() {
    getRandomValues(rnds8);
    return rnds8;
  };
} else {
  // Math.random()-based (RNG)
  //
  // If all else fails, use Math.random().  It's fast, but is of unspecified
  // quality.
  var rnds = new Array(16);

  module.exports = function mathRNG() {
    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return rnds;
  };
}
});

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4
  return ([bth[buf[i++]], bth[buf[i++]], 
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]],
	bth[buf[i++]], bth[buf[i++]],
	bth[buf[i++]], bth[buf[i++]]]).join('');
}

var bytesToUuid_1 = bytesToUuid;

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options === 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rngBrowser)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid_1(rnds);
}

var v4_1 = v4;

const MODE = {
    SHOW: "show",
    HIDE: "hide"
};
const transitionOptionKeys = {
    showDuration: true,
    showDelay: true,
    showTimingFunction: true,
    hideDuration: true,
    hideDelay: true,
    hideTimingFunction: true,
    transitions: true,
    transitionClassName: true,
    showClassName: true,
    didShow: true,
    didHide: true,
    timeout: true,
};
const transition = (props, mode) => {
    const domElement = props.domElements
        ? props.domElements.domElement
        : null;
    if (!domElement) {
        return Promise.reject();
    }
    return new Promise(resolve => {
        const style = domElement.style;
        const computedStyle =  window.getComputedStyle(domElement)
            ;
        const isShow = mode === MODE.SHOW;
        const transitionProps = getTransitionProps({
            showDuration: props.showDuration,
            showDelay: props.showDelay,
            showTimingFunction: props.showTimingFunction,
            hideDuration: props.hideDuration,
            hideDelay: props.hideDelay,
            hideTimingFunction: props.hideTimingFunction,
            transitions: props.transitions,
            domElements: props.domElements,
        }, isShow);
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
                // domElement.offsetHeight; // force reflow
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

var Stream = stream;

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
            add: (item, ns) => {
                update((state) => {
                    const items = state.store[ns] || [];
                    state.store[ns] = [...items, item];
                    return state;
                });
            },
            /**
             * Removes the first item with a match on `id`.
             */
            remove: (id, ns) => {
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
            replace: (id, newItem, ns) => {
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
            store: (newItems, ns) => {
                update((state) => {
                    state.store[ns] = [...newItems];
                    return state;
                });
            },
        };
    },
    selectors: (states) => {
        return {
            find: (spawnOptions, ns) => {
                const state = states();
                const items = state.store[ns] || [];
                const id = createId(spawnOptions, ns);
                const item = items.find((item) => item.id === id);
                return item
                    ? { just: item }
                    : { nothing: undefined };
            },
            getAll: (ns) => {
                const state = states();
                return state.store[ns] || [];
            },
            getCount: (ns) => {
                const state = states();
                return (state.store[ns] || []).length;
            },
        };
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

const isClient = typeof document !== "undefined";

const Timer = () => {
    let timerId;
    let startTime;
    let remaining;
    let cb;
    let onDone;
    let onAbort;
    const stop = () => {
        if (isClient) {
            window.clearTimeout(timerId);
            timerId = -1;
        }
    };
    const abort = () => (stop(),
        onAbort && onAbort());
    const pause = () => (stop(),
        remaining -= new Date().getTime() - startTime);
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
    const start = (callback, duration) => {
        cb = callback;
        remaining = duration;
        return new Promise((resolve, reject) => {
            onDone = () => resolve();
            onAbort = () => resolve();
            startTimer();
        });
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

const filterBySpawnId = (nsItems, spawn) => nsItems.filter(item => item.spawnOptions.spawn === spawn);
/**
 * Gets a list of all non-queued items.
 * From the queued items only the first item is listed.
 * */
const filterQueued = (nsItems, ns) => {
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
const getCount = (ns) => selectors.getCount(ns);
const filter = (items, spawn, ns) => {
    const nsItems = items[ns] || [];
    return filterBySpawnId(filterQueued(nsItems), spawn);
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
const createInstance = (ns, defaultTransitionOptions, defaultSpawnOptions) => (options, instanceSpawnOptions) => {
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
        const uid = v4_1();
        const item = {
            spawnOptions,
            transitionOptions,
            instanceTransitionOptions,
            instanceOptions,
            id,
            timer: Timer(),
            key: spawnOptions.queued
                ? uid // Uniquely identify each item for keyed display
                : id,
        };
        const maybeExistingItem = selectors.find(spawnOptions, ns);
        if (maybeExistingItem.just && !spawnOptions.queued) {
            const existingItem = maybeExistingItem.just;
            // Preserve instanceTransitionOptions
            const instanceTransitionOptions = existingItem.instanceTransitionOptions;
            const replacingItem = {
                ...item,
                instanceTransitionOptions
            };
            actions.replace(existingItem.id, replacingItem, ns);
            // While this is a replace action, mimic a show
            transitionOptions.didShow(spawnOptions.id);
        }
        else {
            actions.add(item, ns);
            // This will instantiate and draw the instance
            // The instance will call `showDialog` in `onMount`
        }
    });
};
const show = createInstance;
const performOnItem = fn => (ns, defaultSpawnOptions) => (instanceSpawnOptions) => {
    const spawnOptions = {
        ...defaultSpawnOptions,
        ...instanceSpawnOptions,
    };
    const maybeItem = selectors.find(spawnOptions, ns);
    if (maybeItem.just) {
        return fn(maybeItem.just, ns);
    }
    else {
        return Promise.resolve();
    }
};
const hide = performOnItem((item, ns) => hideItem(item, ns));
const pause = performOnItem((item, ns) => {
    if (item && item.timer) {
        item.timer.pause();
    }
    return Promise.resolve();
});
const resume = performOnItem((item, ns) => {
    if (item && item.timer) {
        item.timer.resume();
    }
    return Promise.resolve();
});
const resetAll = (ns) => () => {
    selectors.getAll(ns).forEach((item) => item.timer.abort());
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
const hideAll = (ns, defaultSpawnOptions) => (options, instanceSpawnOptions) => {
    const spawnOptions = {
        ...defaultSpawnOptions,
        ...instanceSpawnOptions,
    };
    const allItems = selectors.getAll(ns);
    const regularItems = allItems.filter((item) => !spawnOptions.queued && !item.spawnOptions.queued);
    const queuedItems = allItems.filter((item) => spawnOptions.queued || item.spawnOptions.queued);
    regularItems.forEach((item) => hideItem(getOverridingTransitionOptions(item, options), ns));
    if (queuedItems.length > 0) {
        const [current,] = queuedItems;
        // Make sure that any remaining items don't suddenly appear
        actions.store([current], ns);
        // Transition the current item
        hideItem(getOverridingTransitionOptions(current, options), ns)
            .then(() => actions.removeAll(ns));
    }
};
/**
 * Stop any running timer and remmove the item
 */
const resetItem = (item, ns) => {
    item.timer.abort();
    actions.remove(item.id, ns);
};
const count = (ns) => getCount(ns);
const transitionItem = (item, mode) => {
    return transition({
        ...item.instanceTransitionOptions,
        ...item.transitionOptions,
    }, mode);
};
const deferredHideItem = async function (item, timeout, ns) {
    return item.timer.start(() => (hideItem(item, ns)), timeout);
};
const showItem = async function (item, ns) {
    await (transitionItem(item, MODE.SHOW));
    await (item.transitionOptions.didShow(item.spawnOptions.id));
    if (item.transitionOptions.timeout) {
        await (deferredHideItem(item, item.transitionOptions.timeout, ns));
    }
    return item.spawnOptions.id;
};
const hideItem = async function (item, ns) {
    // Stop any running timer
    if (item.transitionOptions.timeout) {
        item.timer.stop();
    }
    await (transitionItem(item, MODE.HIDE));
    await (item.transitionOptions.didHide(item.spawnOptions.id));
    actions.remove(item.id, ns);
    return item.spawnOptions.id;
};

const ns = "notification";
const defaultId = `default_${ns}`;
const defaultSpawn = `default_${ns}`;
const defaultSpawnOptions = {
    id: defaultId,
    queued: true,
    spawn: defaultSpawn,
};
const defaultTransitionOptions = {
    timeout: 3000,
};
const show$1 = show(ns, defaultTransitionOptions, defaultSpawnOptions);
const hide$1 = hide(ns, defaultSpawnOptions);
const pause$1 = pause(ns, defaultSpawnOptions);
const resume$1 = resume(ns, defaultSpawnOptions);
const resetAll$1 = resetAll(ns);
const hideAll$1 = hideAll(ns, defaultSpawnOptions);
const count$1 = count(ns);

var notification = /*#__PURE__*/Object.freeze({
	ns: ns,
	defaultId: defaultId,
	defaultSpawn: defaultSpawn,
	show: show$1,
	hide: hide$1,
	pause: pause$1,
	resume: resume$1,
	resetAll: resetAll$1,
	hideAll: hideAll$1,
	count: count$1
});

const ns$1 = "dialog";
const defaultId$1 = `default_${ns$1}`;
const defaultSpawn$1 = `default_${ns$1}`;
const defaultSpawnOptions$1 = {
    id: defaultId$1,
    spawn: defaultSpawn$1,
};
const defaultTransitionOptions$1 = {};
const show$2 = show(ns$1, defaultTransitionOptions$1, defaultSpawnOptions$1);
const hide$2 = hide(ns$1, defaultSpawnOptions$1);
const pause$2 = pause(ns$1, defaultSpawnOptions$1);
const resume$2 = resume(ns$1, defaultSpawnOptions$1);
const resetAll$2 = resetAll(ns$1);
const hideAll$2 = hideAll(ns$1, defaultSpawnOptions$1);
const count$2 = count(ns$1);

var dialog = /*#__PURE__*/Object.freeze({
	ns: ns$1,
	defaultId: defaultId$1,
	defaultSpawn: defaultSpawn$1,
	show: show$2,
	hide: hide$2,
	pause: pause$2,
	resume: resume$2,
	resetAll: resetAll$2,
	hideAll: hideAll$2,
	count: count$2
});

export { actions, count, dialog, filter, hide, hideAll, hideItem, notification, pause, performOnItem, resetAll, resetItem, resume, selectors, show, showItem, states };
//# sourceMappingURL=dialogic.mjs.map
