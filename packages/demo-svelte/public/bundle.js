var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function validate_store(store, name) {
        if (!store || typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, callback) {
        const unsub = store.subscribe(callback);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        for (const key in attributes) {
            if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key in node) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_data(text, data) {
        data = '' + data;
        if (text.data !== data)
            text.data = data;
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = current_component;
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function flush() {
        const seen_callbacks = new Set();
        do {
            // first, call beforeUpdate functions
            // and update components
            while (dirty_components.length) {
                const component = dirty_components.shift();
                set_current_component(component);
                update(component.$$);
            }
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    callback();
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
    }
    function update($$) {
        if ($$.fragment) {
            $$.update($$.dirty);
            run_all($$.before_update);
            $$.fragment.p($$.dirty, $$.ctx);
            $$.dirty = null;
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, changed, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(changed, child_ctx);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        if (component.$$.fragment) {
            run_all(component.$$.on_destroy);
            component.$$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            component.$$.on_destroy = component.$$.fragment = null;
            component.$$.ctx = {};
        }
    }
    function make_dirty(component, key) {
        if (!component.$$.dirty) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty = blank_object();
        }
        component.$$.dirty[key] = true;
    }
    function init(component, options, instance, create_fragment, not_equal, prop_names) {
        const parent_component = current_component;
        set_current_component(component);
        const props = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props: prop_names,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty: null
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, props, (key, value) => {
                if ($$.ctx && not_equal($$.ctx[key], $$.ctx[key] = value)) {
                    if ($$.bound[key])
                        $$.bound[key](value);
                    if (ready)
                        make_dirty(component, key);
                }
            })
            : props;
        $$.update();
        ready = true;
        run_all($$.before_update);
        $$.fragment = create_fragment($$.ctx);
        if (options.target) {
            if (options.hydrate) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment.l(children(options.target));
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
    }

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
    const update$1 = Stream();
    const states = Stream.scan((state, patch) => patch(state), {
        ...store.initialState,
    }, update$1);
    const actions = {
        ...store.actions(update$1),
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
                onAbort = () => reject();
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

    let uid = 0;
    const getUid = () => uid === Number.MAX_SAFE_INTEGER
        ? 0
        : uid++;
    const transitionStates = {
        none: "none",
        hiding: "hiding"
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
                timer: Timer(),
                key: uid,
                transitionState: transitionStates.none,
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
    const performOnItem = fn => (ns) => (defaultSpawnOptions) => (instanceSpawnOptions) => {
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
    const hide = performOnItem((item, ns) => {
        if (item.transitionState !== transitionStates.hiding) {
            item.transitionState = transitionStates.hiding;
            return hideItem(item, ns);
        }
        else {
            return Promise.resolve();
        }
    });
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
    const hideAll = (ns) => (defaultSpawnOptions) => (options, instanceSpawnOptions) => {
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
    const show$1 = show(ns)(defaultSpawnOptions)(defaultTransitionOptions);
    const hide$1 = hide(ns)(defaultSpawnOptions);
    const pause$1 = pause(ns)(defaultSpawnOptions);
    const resume$1 = resume(ns)(defaultSpawnOptions);
    const hideAll$1 = hideAll(ns)(defaultSpawnOptions);
    const resetAll$1 = resetAll(ns);
    const count$1 = count(ns);

    var notification = /*#__PURE__*/Object.freeze({
    	ns: ns,
    	defaultId: defaultId,
    	defaultSpawn: defaultSpawn,
    	show: show$1,
    	hide: hide$1,
    	pause: pause$1,
    	resume: resume$1,
    	hideAll: hideAll$1,
    	resetAll: resetAll$1,
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
    const show$2 = show(ns$1)(defaultSpawnOptions$1)(defaultTransitionOptions$1);
    const hide$2 = hide(ns$1)(defaultSpawnOptions$1);
    const pause$2 = pause(ns$1)(defaultSpawnOptions$1);
    const resume$2 = resume(ns$1)(defaultSpawnOptions$1);
    const hideAll$2 = hideAll(ns$1)(defaultSpawnOptions$1);
    const resetAll$2 = resetAll(ns$1);
    const count$2 = count(ns$1);

    var dialog = /*#__PURE__*/Object.freeze({
    	ns: ns$1,
    	defaultId: defaultId$1,
    	defaultSpawn: defaultSpawn$1,
    	show: show$2,
    	hide: hide$2,
    	pause: pause$2,
    	resume: resume$2,
    	hideAll: hideAll$2,
    	resetAll: resetAll$2,
    	count: count$2
    });
    //# sourceMappingURL=dialogic.mjs.map

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe,
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    /**
     * Derived value store by synchronizing one or more readable stores and
     * applying an aggregation function over its input values.
     * @param {Stores} stores input stores
     * @param {function(Stores=, function(*)=):*}fn function callback that aggregates the values
     * @param {*=}initial_value when used asynchronously
     */
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => store.subscribe((value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    const appState = {
      ...writable(states),
      ...selectors
    };

    states.map(state => appState.set({
      ...state,
      ...selectors
    }));

    const getCount$1 = (ns) => derived(
    	appState,
    	() => selectors.getCount(ns)
    );

    const dialog$1 = {
      ...dialog,
      count: getCount$1(dialog.ns),
    };

    const notification$1 = {
      ...notification,
      count: getCount$1(notification.ns),
    };

    // import { Dialogic } from "dialogic";

    const handleDispatch = (ns) => (event, fn) => {
      // Update dispatching item:
      const maybeItem = selectors.find(event.detail.spawnOptions, ns);
      if (maybeItem.just) {
        maybeItem.just.instanceTransitionOptions = event.detail.transitionOptions;
      }
      // Find item to transition:
      const maybeTransitioningItem = selectors.find(event.detail.spawnOptions, ns);
      if (maybeTransitioningItem.just) {
        fn(maybeTransitioningItem.just, ns);
      }
    };

    const onInstanceMounted = (ns) => (event) =>
      handleDispatch(ns)(event, showItem);
      
    const onShowInstance = (ns) => (event) =>
      handleDispatch(ns)(event, showItem);

    const onHideInstance = (ns) => (event) =>
      handleDispatch(ns)(event, hideItem);

    /* Users/arthur/code/Github Projects/dialogic/master/packages/dialogic-svelte/src/Dialogic.svelte generated by Svelte v3.6.11 */

    function get_each_context(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.spawnOptions = list[i].spawnOptions;
    	child_ctx.transitionOptions = list[i].transitionOptions;
    	child_ctx.instanceOptions = list[i].instanceOptions;
    	child_ctx.key = list[i].key;
    	child_ctx.index = i;
    	return child_ctx;
    }

    // (18:0) {#each filter($appState.store, spawnOptions.spawn, ns) as { spawnOptions, transitionOptions, instanceOptions, key }
    function create_each_block(key_1, ctx) {
    	var first, current;

    	var instance = new ctx.Instance({
    		props: {
    		spawnOptions: ctx.spawnOptions,
    		transitionOptions: ctx.transitionOptions,
    		instanceOptions: ctx.instanceOptions
    	},
    		$$inline: true
    	});
    	instance.$on("mount", ctx.nsOnInstanceMounted);
    	instance.$on("show", ctx.nsOnShowInstance);
    	instance.$on("hide", ctx.nsOnHideInstance);

    	return {
    		key: key_1,

    		first: null,

    		c: function create() {
    			first = empty();
    			instance.$$.fragment.c();
    			this.first = first;
    		},

    		m: function mount(target, anchor) {
    			insert(target, first, anchor);
    			mount_component(instance, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var instance_changes = {};
    			if (changed.filter || changed.$appState || changed.spawnOptions || changed.ns) instance_changes.spawnOptions = ctx.spawnOptions;
    			if (changed.filter || changed.$appState || changed.spawnOptions || changed.ns) instance_changes.transitionOptions = ctx.transitionOptions;
    			if (changed.filter || changed.$appState || changed.spawnOptions || changed.ns) instance_changes.instanceOptions = ctx.instanceOptions;
    			instance.$set(instance_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(instance.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(instance.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(first);
    			}

    			destroy_component(instance, detaching);
    		}
    	};
    }

    function create_fragment(ctx) {
    	var each_blocks = [], each_1_lookup = new Map(), each_1_anchor, current;

    	var each_value = filter(ctx.$appState.store, ctx.spawnOptions.spawn, ctx.ns);

    	const get_key = ctx => ctx.key;

    	for (var i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	return {
    		c: function create() {
    			for (i = 0; i < each_blocks.length; i += 1) each_blocks[i].c();

    			each_1_anchor = empty();
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			for (i = 0; i < each_blocks.length; i += 1) each_blocks[i].m(target, anchor);

    			insert(target, each_1_anchor, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			const each_value = filter(ctx.$appState.store, ctx.spawnOptions.spawn, ctx.ns);

    			group_outros();
    			each_blocks = update_keyed_each(each_blocks, changed, get_key, 1, ctx, each_value, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block, each_1_anchor, get_each_context);
    			check_outros();
    		},

    		i: function intro(local) {
    			if (current) return;
    			for (var i = 0; i < each_value.length; i += 1) transition_in(each_blocks[i]);

    			current = true;
    		},

    		o: function outro(local) {
    			for (i = 0; i < each_blocks.length; i += 1) transition_out(each_blocks[i]);

    			current = false;
    		},

    		d: function destroy(detaching) {
    			for (i = 0; i < each_blocks.length; i += 1) each_blocks[i].d(detaching);

    			if (detaching) {
    				detach(each_1_anchor);
    			}
    		}
    	};
    }

    function instance_1($$self, $$props, $$invalidate) {
    	let $appState;

    	validate_store(appState, 'appState');
    	component_subscribe($$self, appState, $$value => { $appState = $$value; $$invalidate('$appState', $appState); });

    	

      let { spawnOptions, Instance, ns } = $$props;

      const nsOnInstanceMounted = onInstanceMounted(ns);
      const nsOnShowInstance = onShowInstance(ns);
      const nsOnHideInstance = onHideInstance(ns);

    	const writable_props = ['spawnOptions', 'Instance', 'ns'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Dialogic> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('spawnOptions' in $$props) $$invalidate('spawnOptions', spawnOptions = $$props.spawnOptions);
    		if ('Instance' in $$props) $$invalidate('Instance', Instance = $$props.Instance);
    		if ('ns' in $$props) $$invalidate('ns', ns = $$props.ns);
    	};

    	return {
    		spawnOptions,
    		Instance,
    		ns,
    		nsOnInstanceMounted,
    		nsOnShowInstance,
    		nsOnHideInstance,
    		$appState
    	};
    }

    class Dialogic extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance_1, create_fragment, safe_not_equal, ["spawnOptions", "Instance", "ns"]);

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.spawnOptions === undefined && !('spawnOptions' in props)) {
    			console.warn("<Dialogic> was created without expected prop 'spawnOptions'");
    		}
    		if (ctx.Instance === undefined && !('Instance' in props)) {
    			console.warn("<Dialogic> was created without expected prop 'Instance'");
    		}
    		if (ctx.ns === undefined && !('ns' in props)) {
    			console.warn("<Dialogic> was created without expected prop 'ns'");
    		}
    	}

    	get spawnOptions() {
    		throw new Error("<Dialogic>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spawnOptions(value) {
    		throw new Error("<Dialogic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get Instance() {
    		throw new Error("<Dialogic>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set Instance(value) {
    		throw new Error("<Dialogic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ns() {
    		throw new Error("<Dialogic>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ns(value) {
    		throw new Error("<Dialogic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* Users/arthur/code/Github Projects/dialogic/master/packages/dialogic-svelte/src/Instance.svelte generated by Svelte v3.6.11 */

    const file = "Users/arthur/code/Github Projects/dialogic/master/packages/dialogic-svelte/src/Instance.svelte";

    function create_fragment$1(ctx) {
    	var div, current;

    	var switch_instance_spread_levels = [
    		{ hide: ctx.hide },
    		ctx.instanceOptions
    	];

    	var switch_value = ctx.transitionOptions.component;

    	function switch_props(ctx) {
    		let switch_instance_props = {};
    		for (var i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}
    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		var switch_instance = new switch_value(switch_props());
    	}

    	var div_levels = [
    		{ class: ctx.R_classNames },
    		ctx.elementProps
    	];

    	var div_data = {};
    	for (var i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	return {
    		c: function create() {
    			div = element("div");
    			if (switch_instance) switch_instance.$$.fragment.c();
    			set_attributes(div, div_data);
    			add_location(div, file, 46, 0, 905);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);

    			if (switch_instance) {
    				mount_component(switch_instance, div, null);
    			}

    			ctx.div_binding(div);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var switch_instance_changes = (changed.hide || changed.instanceOptions) ? get_spread_update(switch_instance_spread_levels, [
    				(changed.hide) && { hide: ctx.hide },
    				(changed.instanceOptions) && ctx.instanceOptions
    			]) : {};

    			if (switch_value !== (switch_value = ctx.transitionOptions.component)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;
    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});
    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());

    					switch_instance.$$.fragment.c();
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, div, null);
    				} else {
    					switch_instance = null;
    				}
    			}

    			else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}

    			set_attributes(div, get_spread_update(div_levels, [
    				(changed.R_classNames) && { class: ctx.R_classNames },
    				(changed.elementProps) && ctx.elementProps
    			]));
    		},

    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}

    			if (switch_instance) destroy_component(switch_instance);
    			ctx.div_binding(null);
    		}
    	};
    }

    function instance($$self, $$props, $$invalidate) {
    	const dispatch = createEventDispatcher();

      // DOM bindings
      let domElement;

      let { spawnOptions = undefined, instanceOptions = undefined, transitionOptions = undefined } = $$props;

      const dispatchTransition = (name) =>
        dispatch(name, {
          spawnOptions,
          transitionOptions: {
            className: transitionOptions.className,
            showClassName: transitionOptions.showClassName,
            domElements: {
              domElement
            },
          },
        });

      const hide = () => {
        dispatchTransition("hide");
      };

      onMount(() => {
        dispatchTransition("mount");
      });

    	const writable_props = ['spawnOptions', 'instanceOptions', 'transitionOptions'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Instance> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			$$invalidate('domElement', domElement = $$value);
    		});
    	}

    	$$self.$set = $$props => {
    		if ('spawnOptions' in $$props) $$invalidate('spawnOptions', spawnOptions = $$props.spawnOptions);
    		if ('instanceOptions' in $$props) $$invalidate('instanceOptions', instanceOptions = $$props.instanceOptions);
    		if ('transitionOptions' in $$props) $$invalidate('transitionOptions', transitionOptions = $$props.transitionOptions);
    	};

    	let R_classNames, elementProps;

    	$$self.$$.update = ($$dirty = { transitionOptions: 1, instanceOptions: 1, R_classNames: 1 }) => {
    		if ($$dirty.transitionOptions || $$dirty.instanceOptions) { $$invalidate('R_classNames', R_classNames = [,
            transitionOptions.className,
            instanceOptions.className
        	].join(" ")); }
    		if ($$dirty.R_classNames) { $$invalidate('elementProps', elementProps = {
            class: R_classNames,
          }); }
    	};

    	return {
    		domElement,
    		spawnOptions,
    		instanceOptions,
    		transitionOptions,
    		hide,
    		R_classNames,
    		elementProps,
    		div_binding
    	};
    }

    class Instance extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment$1, safe_not_equal, ["spawnOptions", "instanceOptions", "transitionOptions"]);
    	}

    	get spawnOptions() {
    		throw new Error("<Instance>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spawnOptions(value) {
    		throw new Error("<Instance>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get instanceOptions() {
    		throw new Error("<Instance>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set instanceOptions(value) {
    		throw new Error("<Instance>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transitionOptions() {
    		throw new Error("<Instance>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transitionOptions(value) {
    		throw new Error("<Instance>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* Users/arthur/code/Github Projects/dialogic/master/packages/dialogic-svelte/src/Dialog.svelte generated by Svelte v3.6.11 */

    function create_fragment$2(ctx) {
    	var current;

    	var dialogic = new Dialogic({
    		props: {
    		Instance: Instance,
    		spawnOptions: ctx.spawnOptions,
    		ns: dialog$1.ns
    	},
    		$$inline: true
    	});

    	return {
    		c: function create() {
    			dialogic.$$.fragment.c();
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			mount_component(dialogic, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var dialogic_changes = {};
    			if (changed.Instance) dialogic_changes.Instance = Instance;
    			if (changed.spawnOptions) dialogic_changes.spawnOptions = ctx.spawnOptions;
    			if (changed.dialog) dialogic_changes.ns = dialog$1.ns;
    			dialogic.$set(dialogic_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(dialogic.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(dialogic.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(dialogic, detaching);
    		}
    	};
    }

    function instance$1($$self, $$props, $$invalidate) {
    	

      let { spawn = dialog$1.defaultSpawn, id = dialog$1.defaultId } = $$props;

      const spawnOptions = {
        id,
        spawn,
      };

    	const writable_props = ['spawn', 'id'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Dialog> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('spawn' in $$props) $$invalidate('spawn', spawn = $$props.spawn);
    		if ('id' in $$props) $$invalidate('id', id = $$props.id);
    	};

    	return { spawn, id, spawnOptions };
    }

    class Dialog extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$2, safe_not_equal, ["spawn", "id"]);
    	}

    	get spawn() {
    		throw new Error("<Dialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spawn(value) {
    		throw new Error("<Dialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<Dialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Dialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* Users/arthur/code/Github Projects/dialogic/master/packages/dialogic-svelte/src/Notification.svelte generated by Svelte v3.6.11 */

    function create_fragment$3(ctx) {
    	var current;

    	var dialogic = new Dialogic({
    		props: {
    		Instance: Instance,
    		spawnOptions: ctx.spawnOptions,
    		ns: notification$1.ns
    	},
    		$$inline: true
    	});

    	return {
    		c: function create() {
    			dialogic.$$.fragment.c();
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			mount_component(dialogic, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var dialogic_changes = {};
    			if (changed.Instance) dialogic_changes.Instance = Instance;
    			if (changed.spawnOptions) dialogic_changes.spawnOptions = ctx.spawnOptions;
    			if (changed.notification) dialogic_changes.ns = notification$1.ns;
    			dialogic.$set(dialogic_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(dialogic.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(dialogic.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(dialogic, detaching);
    		}
    	};
    }

    function instance$2($$self, $$props, $$invalidate) {
    	

      let { spawn = notification$1.defaultSpawn, id = notification$1.defaultId } = $$props;

      const spawnOptions = {
        id,
        spawn,
      };

    	const writable_props = ['spawn', 'id'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Notification> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('spawn' in $$props) $$invalidate('spawn', spawn = $$props.spawn);
    		if ('id' in $$props) $$invalidate('id', id = $$props.id);
    	};

    	return { spawn, id, spawnOptions };
    }

    class Notification extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$3, safe_not_equal, ["spawn", "id"]);
    	}

    	get spawn() {
    		throw new Error("<Notification>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spawn(value) {
    		throw new Error("<Notification>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<Notification>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Notification>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/default/Content.svelte generated by Svelte v3.6.11 */

    const file$1 = "src/default/Content.svelte";

    function create_fragment$4(ctx) {
    	var div, h2, t0_value = ctx.$$props.title, t0, t1, button, dispose;

    	return {
    		c: function create() {
    			div = element("div");
    			h2 = element("h2");
    			t0 = text(t0_value);
    			t1 = space();
    			button = element("button");
    			button.textContent = "hide from instance";
    			add_location(h2, file$1, 1, 2, 8);
    			add_location(button, file$1, 2, 2, 35);
    			add_location(div, file$1, 0, 0, 0);
    			dispose = listen(button, "click", ctx.$$props.hide);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);
    			append(div, h2);
    			append(h2, t0);
    			append(div, t1);
    			append(div, button);
    		},

    		p: function update(changed, ctx) {
    			if ((changed.$$props) && t0_value !== (t0_value = ctx.$$props.title)) {
    				set_data(t0, t0_value);
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}

    			dispose();
    		}
    	};
    }

    function instance$3($$self, $$props, $$invalidate) {
    	$$self.$set = $$new_props => {
    		$$invalidate('$$props', $$props = assign(assign({}, $$props), $$new_props));
    	};

    	return {
    		$$props,
    		$$props: $$props = exclude_internal_props($$props)
    	};
    }

    class Content extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$4, safe_not_equal, []);
    	}
    }

    function onInterval(callback, milliseconds) {
    	const interval = setInterval(callback, milliseconds);

    	onDestroy(() => {
    		clearInterval(interval);
    	});
    }

    /* src/interval/Content.svelte generated by Svelte v3.6.11 */

    const file$2 = "src/interval/Content.svelte";

    function create_fragment$5(ctx) {
    	var div, h2, t0_value = ctx.$$props.title, t0, t1, t2, t3, t4_value = ctx.seconds === 1 ? 'second' : 'seconds', t4, t5, button, dispose;

    	return {
    		c: function create() {
    			div = element("div");
    			h2 = element("h2");
    			t0 = text(t0_value);
    			t1 = text("\n  The page has been open for\n\t");
    			t2 = text(ctx.seconds);
    			t3 = space();
    			t4 = text(t4_value);
    			t5 = space();
    			button = element("button");
    			button.textContent = "hide from instance";
    			add_location(h2, file$2, 8, 2, 128);
    			add_location(button, file$2, 11, 2, 234);
    			add_location(div, file$2, 7, 0, 120);
    			dispose = listen(button, "click", ctx.$$props.hide);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);
    			append(div, h2);
    			append(h2, t0);
    			append(div, t1);
    			append(div, t2);
    			append(div, t3);
    			append(div, t4);
    			append(div, t5);
    			append(div, button);
    		},

    		p: function update(changed, ctx) {
    			if ((changed.$$props) && t0_value !== (t0_value = ctx.$$props.title)) {
    				set_data(t0, t0_value);
    			}

    			if (changed.seconds) {
    				set_data(t2, ctx.seconds);
    			}

    			if ((changed.seconds) && t4_value !== (t4_value = ctx.seconds === 1 ? 'second' : 'seconds')) {
    				set_data(t4, t4_value);
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}

    			dispose();
    		}
    	};
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let seconds = 0;
    	onInterval(() => { const $$result = seconds += 1; $$invalidate('seconds', seconds); return $$result; }, 1000);

    	$$self.$set = $$new_props => {
    		$$invalidate('$$props', $$props = assign(assign({}, $$props), $$new_props));
    	};

    	return {
    		seconds,
    		$$props,
    		$$props: $$props = exclude_internal_props($$props)
    	};
    }

    class Content$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$5, safe_not_equal, []);
    	}
    }

    /* src/App.svelte generated by Svelte v3.6.11 */

    const file$3 = "src/App.svelte";

    // (98:0) {#if showDialogs}
    function create_if_block_1(ctx) {
    	var h2, t1, p0, t2, t3, t4, hr0, t5, div0, button0, t7, button1, t9, div1, button2, t11, button3, t13, div2, button4, t15, button5, t17, div3, button6, t19, button7, t21, div4, button8, t23, button9, t25, div5, button10, t27, button11, t29, div6, button12, t31, button13, t33, hr1, t34, div7, p1, t36, t37, div8, p2, t39, t40, hr2, t41, div9, button14, t43, button15, t45, div10, p3, t47, current, dispose;

    	var dialog0 = new Dialog({ $$inline: true });

    	var dialog1 = new Dialog({
    		props: { spawn: "special" },
    		$$inline: true
    	});

    	var dialog2 = new Dialog({ props: { spawn: "Q" }, $$inline: true });

    	return {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "Dialog";
    			t1 = space();
    			p0 = element("p");
    			t2 = text("Dialog count = ");
    			t3 = text(ctx.$dialogCount);
    			t4 = space();
    			hr0 = element("hr");
    			t5 = space();
    			div0 = element("div");
    			button0 = element("button");
    			button0.textContent = "Default";
    			t7 = space();
    			button1 = element("button");
    			button1.textContent = "Hide";
    			t9 = space();
    			div1 = element("div");
    			button2 = element("button");
    			button2.textContent = "With timer";
    			t11 = space();
    			button3 = element("button");
    			button3.textContent = "Hide";
    			t13 = space();
    			div2 = element("div");
    			button4 = element("button");
    			button4.textContent = "Show with promises";
    			t15 = space();
    			button5 = element("button");
    			button5.textContent = "Hide";
    			t17 = space();
    			div3 = element("div");
    			button6 = element("button");
    			button6.textContent = "Show delay";
    			t19 = space();
    			button7 = element("button");
    			button7.textContent = "Hide";
    			t21 = space();
    			div4 = element("div");
    			button8 = element("button");
    			button8.textContent = "Show slow fade";
    			t23 = space();
    			button9 = element("button");
    			button9.textContent = "Hide";
    			t25 = space();
    			div5 = element("div");
    			button10 = element("button");
    			button10.textContent = "Show transition";
    			t27 = space();
    			button11 = element("button");
    			button11.textContent = "Hide";
    			t29 = space();
    			div6 = element("div");
    			button12 = element("button");
    			button12.textContent = "Show default in spawn";
    			t31 = space();
    			button13 = element("button");
    			button13.textContent = "Hide";
    			t33 = space();
    			hr1 = element("hr");
    			t34 = space();
    			div7 = element("div");
    			p1 = element("p");
    			p1.textContent = "Dialog:";
    			t36 = space();
    			dialog0.$$.fragment.c();
    			t37 = space();
    			div8 = element("div");
    			p2 = element("p");
    			p2.textContent = "Dialog with spawn:";
    			t39 = space();
    			dialog1.$$.fragment.c();
    			t40 = space();
    			hr2 = element("hr");
    			t41 = text("\nQueued dialog\n");
    			div9 = element("div");
    			button14 = element("button");
    			button14.textContent = "Queued";
    			t43 = space();
    			button15 = element("button");
    			button15.textContent = "Hide";
    			t45 = space();
    			div10 = element("div");
    			p3 = element("p");
    			p3.textContent = "Dialog queued:";
    			t47 = space();
    			dialog2.$$.fragment.c();
    			add_location(h2, file$3, 99, 0, 2505);
    			add_location(p0, file$3, 101, 0, 2522);
    			add_location(hr0, file$3, 103, 0, 2561);
    			add_location(button0, file$3, 106, 2, 2577);
    			add_location(button1, file$3, 113, 2, 2710);
    			add_location(div0, file$3, 105, 0, 2569);
    			add_location(button2, file$3, 117, 2, 2779);
    			add_location(button3, file$3, 125, 2, 2939);
    			add_location(div1, file$3, 116, 0, 2771);
    			add_location(button4, file$3, 129, 2, 3043);
    			add_location(button5, file$3, 145, 2, 3451);
    			add_location(div2, file$3, 128, 0, 3035);
    			add_location(button6, file$3, 152, 2, 3601);
    			add_location(button7, file$3, 161, 2, 3834);
    			add_location(div3, file$3, 151, 0, 3593);
    			add_location(button8, file$3, 164, 2, 3927);
    			add_location(button9, file$3, 168, 2, 4045);
    			add_location(div4, file$3, 163, 0, 3919);
    			add_location(button10, file$3, 171, 2, 4138);
    			add_location(button11, file$3, 175, 2, 4259);
    			add_location(div5, file$3, 170, 0, 4130);
    			add_location(button12, file$3, 178, 2, 4353);
    			add_location(button13, file$3, 185, 2, 4527);
    			add_location(div6, file$3, 177, 0, 4345);
    			add_location(hr1, file$3, 188, 0, 4608);
    			add_location(p1, file$3, 191, 2, 4624);
    			add_location(div7, file$3, 190, 0, 4616);
    			add_location(p2, file$3, 196, 2, 4668);
    			add_location(div8, file$3, 195, 0, 4660);
    			add_location(hr2, file$3, 200, 0, 4731);
    			add_location(button14, file$3, 203, 2, 4760);
    			add_location(button15, file$3, 210, 2, 4957);
    			add_location(div9, file$3, 202, 0, 4752);
    			add_location(p3, file$3, 214, 2, 5040);
    			add_location(div10, file$3, 213, 0, 5032);

    			dispose = [
    				listen(button0, "click", ctx.click_handler_5),
    				listen(button1, "click", ctx.click_handler_6),
    				listen(button2, "click", ctx.click_handler_7),
    				listen(button3, "click", ctx.click_handler_8),
    				listen(button4, "click", ctx.click_handler_9),
    				listen(button5, "click", ctx.click_handler_10),
    				listen(button6, "click", ctx.click_handler_11),
    				listen(button7, "click", ctx.click_handler_12),
    				listen(button8, "click", ctx.click_handler_13),
    				listen(button9, "click", ctx.click_handler_14),
    				listen(button10, "click", ctx.click_handler_15),
    				listen(button11, "click", ctx.click_handler_16),
    				listen(button12, "click", ctx.click_handler_17),
    				listen(button13, "click", ctx.click_handler_18),
    				listen(button14, "click", ctx.click_handler_19),
    				listen(button15, "click", ctx.click_handler_20)
    			];
    		},

    		m: function mount(target, anchor) {
    			insert(target, h2, anchor);
    			insert(target, t1, anchor);
    			insert(target, p0, anchor);
    			append(p0, t2);
    			append(p0, t3);
    			insert(target, t4, anchor);
    			insert(target, hr0, anchor);
    			insert(target, t5, anchor);
    			insert(target, div0, anchor);
    			append(div0, button0);
    			append(div0, t7);
    			append(div0, button1);
    			insert(target, t9, anchor);
    			insert(target, div1, anchor);
    			append(div1, button2);
    			append(div1, t11);
    			append(div1, button3);
    			insert(target, t13, anchor);
    			insert(target, div2, anchor);
    			append(div2, button4);
    			append(div2, t15);
    			append(div2, button5);
    			insert(target, t17, anchor);
    			insert(target, div3, anchor);
    			append(div3, button6);
    			append(div3, t19);
    			append(div3, button7);
    			insert(target, t21, anchor);
    			insert(target, div4, anchor);
    			append(div4, button8);
    			append(div4, t23);
    			append(div4, button9);
    			insert(target, t25, anchor);
    			insert(target, div5, anchor);
    			append(div5, button10);
    			append(div5, t27);
    			append(div5, button11);
    			insert(target, t29, anchor);
    			insert(target, div6, anchor);
    			append(div6, button12);
    			append(div6, t31);
    			append(div6, button13);
    			insert(target, t33, anchor);
    			insert(target, hr1, anchor);
    			insert(target, t34, anchor);
    			insert(target, div7, anchor);
    			append(div7, p1);
    			append(div7, t36);
    			mount_component(dialog0, div7, null);
    			insert(target, t37, anchor);
    			insert(target, div8, anchor);
    			append(div8, p2);
    			append(div8, t39);
    			mount_component(dialog1, div8, null);
    			insert(target, t40, anchor);
    			insert(target, hr2, anchor);
    			insert(target, t41, anchor);
    			insert(target, div9, anchor);
    			append(div9, button14);
    			append(div9, t43);
    			append(div9, button15);
    			insert(target, t45, anchor);
    			insert(target, div10, anchor);
    			append(div10, p3);
    			append(div10, t47);
    			mount_component(dialog2, div10, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (!current || changed.$dialogCount) {
    				set_data(t3, ctx.$dialogCount);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(dialog0.$$.fragment, local);

    			transition_in(dialog1.$$.fragment, local);

    			transition_in(dialog2.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(dialog0.$$.fragment, local);
    			transition_out(dialog1.$$.fragment, local);
    			transition_out(dialog2.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(h2);
    				detach(t1);
    				detach(p0);
    				detach(t4);
    				detach(hr0);
    				detach(t5);
    				detach(div0);
    				detach(t9);
    				detach(div1);
    				detach(t13);
    				detach(div2);
    				detach(t17);
    				detach(div3);
    				detach(t21);
    				detach(div4);
    				detach(t25);
    				detach(div5);
    				detach(t29);
    				detach(div6);
    				detach(t33);
    				detach(hr1);
    				detach(t34);
    				detach(div7);
    			}

    			destroy_component(dialog0);

    			if (detaching) {
    				detach(t37);
    				detach(div8);
    			}

    			destroy_component(dialog1);

    			if (detaching) {
    				detach(t40);
    				detach(hr2);
    				detach(t41);
    				detach(div9);
    				detach(t45);
    				detach(div10);
    			}

    			destroy_component(dialog2);

    			run_all(dispose);
    		}
    	};
    }

    // (225:0) {#if showNotifications}
    function create_if_block(ctx) {
    	var h2, t1, div0, button0, t3, button1, t5, button2, t7, button3, t9, div1, p0, t11, p1, t12, t13, t14, t15, hr, current, dispose;

    	var notification_1 = new Notification({ props: { spawn: "NO" }, $$inline: true });

    	return {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "Notification";
    			t1 = space();
    			div0 = element("div");
    			button0 = element("button");
    			button0.textContent = "Queued";
    			t3 = space();
    			button1 = element("button");
    			button1.textContent = "Hide";
    			t5 = space();
    			button2 = element("button");
    			button2.textContent = "Pause";
    			t7 = space();
    			button3 = element("button");
    			button3.textContent = "Resume";
    			t9 = space();
    			div1 = element("div");
    			p0 = element("p");
    			p0.textContent = "Notification queued:";
    			t11 = space();
    			p1 = element("p");
    			t12 = text("Notification count = ");
    			t13 = text(ctx.$notificationCount);
    			t14 = space();
    			notification_1.$$.fragment.c();
    			t15 = space();
    			hr = element("hr");
    			add_location(h2, file$3, 226, 0, 5228);
    			add_location(button0, file$3, 229, 2, 5259);
    			add_location(button1, file$3, 249, 2, 5783);
    			add_location(button2, file$3, 255, 2, 5951);
    			add_location(button3, file$3, 260, 2, 6055);
    			add_location(div0, file$3, 228, 0, 5251);
    			add_location(p0, file$3, 268, 2, 6167);
    			add_location(p1, file$3, 269, 2, 6197);
    			add_location(div1, file$3, 267, 0, 6159);
    			add_location(hr, file$3, 273, 0, 6285);

    			dispose = [
    				listen(button0, "click", ctx.click_handler_22),
    				listen(button1, "click", ctx.click_handler_23),
    				listen(button2, "click", ctx.click_handler_24),
    				listen(button3, "click", ctx.click_handler_25)
    			];
    		},

    		m: function mount(target, anchor) {
    			insert(target, h2, anchor);
    			insert(target, t1, anchor);
    			insert(target, div0, anchor);
    			append(div0, button0);
    			append(div0, t3);
    			append(div0, button1);
    			append(div0, t5);
    			append(div0, button2);
    			append(div0, t7);
    			append(div0, button3);
    			insert(target, t9, anchor);
    			insert(target, div1, anchor);
    			append(div1, p0);
    			append(div1, t11);
    			append(div1, p1);
    			append(p1, t12);
    			append(p1, t13);
    			append(div1, t14);
    			mount_component(notification_1, div1, null);
    			insert(target, t15, anchor);
    			insert(target, hr, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (!current || changed.$notificationCount) {
    				set_data(t13, ctx.$notificationCount);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(notification_1.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(notification_1.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(h2);
    				detach(t1);
    				detach(div0);
    				detach(t9);
    				detach(div1);
    			}

    			destroy_component(notification_1);

    			if (detaching) {
    				detach(t15);
    				detach(hr);
    			}

    			run_all(dispose);
    		}
    	};
    }

    function create_fragment$6(ctx) {
    	var button0, t1, button1, t3, button2, t5, button3, t7, hr0, t8, button4, t10, t11, hr1, t12, button5, t14, if_block1_anchor, current, dispose;

    	var if_block0 = (ctx.showDialogs) && create_if_block_1(ctx);

    	var if_block1 = (ctx.showNotifications) && create_if_block(ctx);

    	return {
    		c: function create() {
    			button0 = element("button");
    			button0.textContent = "Clear notifications";
    			t1 = space();
    			button1 = element("button");
    			button1.textContent = "Reset notifications";
    			t3 = space();
    			button2 = element("button");
    			button2.textContent = "Clear dialogs";
    			t5 = space();
    			button3 = element("button");
    			button3.textContent = "Reset dialogs";
    			t7 = space();
    			hr0 = element("hr");
    			t8 = space();
    			button4 = element("button");
    			button4.textContent = "Toggle dialogs";
    			t10 = space();
    			if (if_block0) if_block0.c();
    			t11 = space();
    			hr1 = element("hr");
    			t12 = space();
    			button5 = element("button");
    			button5.textContent = "Toggle notifications";
    			t14 = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    			add_location(button0, file$3, 85, 0, 2032);
    			add_location(button1, file$3, 87, 0, 2145);
    			add_location(button2, file$3, 89, 0, 2240);
    			add_location(button3, file$3, 91, 0, 2318);
    			add_location(hr0, file$3, 93, 0, 2401);
    			add_location(button4, file$3, 95, 0, 2409);
    			add_location(hr1, file$3, 220, 0, 5100);
    			add_location(button5, file$3, 222, 0, 5108);

    			dispose = [
    				listen(button0, "click", ctx.click_handler),
    				listen(button1, "click", ctx.click_handler_1),
    				listen(button2, "click", ctx.click_handler_2),
    				listen(button3, "click", ctx.click_handler_3),
    				listen(button4, "click", ctx.click_handler_4),
    				listen(button5, "click", ctx.click_handler_21)
    			];
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, button0, anchor);
    			insert(target, t1, anchor);
    			insert(target, button1, anchor);
    			insert(target, t3, anchor);
    			insert(target, button2, anchor);
    			insert(target, t5, anchor);
    			insert(target, button3, anchor);
    			insert(target, t7, anchor);
    			insert(target, hr0, anchor);
    			insert(target, t8, anchor);
    			insert(target, button4, anchor);
    			insert(target, t10, anchor);
    			if (if_block0) if_block0.m(target, anchor);
    			insert(target, t11, anchor);
    			insert(target, hr1, anchor);
    			insert(target, t12, anchor);
    			insert(target, button5, anchor);
    			insert(target, t14, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert(target, if_block1_anchor, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (ctx.showDialogs) {
    				if (if_block0) {
    					if_block0.p(changed, ctx);
    					transition_in(if_block0, 1);
    				} else {
    					if_block0 = create_if_block_1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t11.parentNode, t11);
    				}
    			} else if (if_block0) {
    				group_outros();
    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});
    				check_outros();
    			}

    			if (ctx.showNotifications) {
    				if (if_block1) {
    					if_block1.p(changed, ctx);
    					transition_in(if_block1, 1);
    				} else {
    					if_block1 = create_if_block(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				group_outros();
    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});
    				check_outros();
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(button0);
    				detach(t1);
    				detach(button1);
    				detach(t3);
    				detach(button2);
    				detach(t5);
    				detach(button3);
    				detach(t7);
    				detach(hr0);
    				detach(t8);
    				detach(button4);
    				detach(t10);
    			}

    			if (if_block0) if_block0.d(detaching);

    			if (detaching) {
    				detach(t11);
    				detach(hr1);
    				detach(t12);
    				detach(button5);
    				detach(t14);
    			}

    			if (if_block1) if_block1.d(detaching);

    			if (detaching) {
    				detach(if_block1_anchor);
    			}

    			run_all(dispose);
    		}
    	};
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let $dialogCount, $notificationCount;

    	

      const dialogCount = dialog$1.count; validate_store(dialogCount, 'dialogCount'); component_subscribe($$self, dialogCount, $$value => { $dialogCount = $$value; $$invalidate('$dialogCount', $dialogCount); });
      const notificationCount = notification$1.count; validate_store(notificationCount, 'notificationCount'); component_subscribe($$self, notificationCount, $$value => { $notificationCount = $$value; $$invalidate('$notificationCount', $notificationCount); });

      const getRandomNumber = () => Math.round(1000 * Math.random());

      const dialogOneProps = {
        showDuration: 0.5,
        showDelay: 0.25,
        hideDuration: 0.5,
        hideDelay: .25,
        component: Content$1,
        className: "xxx",
        showClassName: "xxx-visible",
        title: "Clock"
      };
      const dialogTwoProps = {
        showDuration: 0.75,
        showDelay: 0,
        hideDuration: 0.75,
        hideDelay: 0,
        component: Content,
        className: "xxx",
        showClassName: "xxx-visible",
        title: "Fade"
      };
      const dialogFourProps = {
        transitions: {
          show: domElements => {
            const el = domElements.domElement;
            return {
              duration: 0.5,
              before: () => (
                (el.style.opacity = 0),
                (el.style.transform = "translate3d(0, 20px, 0)")
              ),
              transition: () => (
                (el.style.opacity = 1),
                (el.style.transform = "translate3d(0, 0px,  0)")
              )
            };
          },
          hide: domElements => {
            const el = domElements.domElement;
            return { duration: 0.5, transition: () => el.style.opacity = 0 };
          },
        },
        component: Content,
        title: "Transitions"
      };

      const clearOptions = {
        transitions: {
          hide: domElements => {
            const el = domElements.domElement;
            return { duration: 0.5, delay: 0, transition: () => el.style.opacity = 0 };
          }
        }
      };

    	function click_handler() {
    		return notification$1.hideAll({ hideDelay: 0, hideDuration: .25 });
    	}

    	function click_handler_1() {
    		return notification$1.resetAll().catch(() => {});
    	}

    	function click_handler_2() {
    		return dialog$1.hideAll(clearOptions);
    	}

    	function click_handler_3() {
    		return dialog$1.resetAll().catch(() => {});
    	}

    	function click_handler_4() {
    		const $$result = showDialogs = !showDialogs;
    		$$invalidate('showDialogs', showDialogs);
    		return $$result;
    	}

    	function click_handler_5() {
    		return dialog$1.show({
    	      component: Content,
    	      title: "Default"
    	    });
    	}

    	function click_handler_6() {
    		return dialog$1.hide();
    	}

    	function click_handler_7() {
    		return dialog$1.show({
    	      timeout: 2000,
    	      component: Content,
    	      title: "With timer"
    	    });
    	}

    	function click_handler_8() {
    		return dialog$1.hide().catch(() => console.log("caught"));
    	}

    	function click_handler_9() {
    		return dialog$1.show(
    	      {
    	        didShow: id => console.log("didShow", id),
    	        didHide: id => console.log("didHide", id),
    	        showDuration: 0.5,
    	        showDelay: 0.25,
    	        component: Content,
    	        title: "With Promise"
    	      },
    	      {
    	        id: "withPromise"
    	      }
    	    ).then(id => console.log("dialog shown", id));
    	}

    	function click_handler_10() {
    		return dialog$1.hide(
    	    {
    	      id: "withPromise"
    	    }).then(id => console.log("dialog hidden", id));
    	}

    	function click_handler_11() {
    		return dialog$1.show({
    	      ...dialogOneProps,
    	      showDelay: .5,
    	      hideDelay: 0,
    	      title: dialogOneProps.title + ' ' + getRandomNumber()
    	    }, { id: dialogOneProps.id });
    	}

    	function click_handler_12() {
    		return dialog$1.hide({ id: dialogOneProps.id });
    	}

    	function click_handler_13() {
    		return dialog$1.show(dialogTwoProps, { id: dialogTwoProps.id });
    	}

    	function click_handler_14() {
    		return dialog$1.hide({ id: dialogTwoProps.id });
    	}

    	function click_handler_15() {
    		return dialog$1.show(dialogFourProps, { id: dialogFourProps.id });
    	}

    	function click_handler_16() {
    		return dialog$1.hide({ id: dialogFourProps.id });
    	}

    	function click_handler_17() {
    		return dialog$1.show({
    	      component: Content,
    	      title: "Custom spawn"
    	    }, { spawn: 'special' });
    	}

    	function click_handler_18() {
    		return dialog$1.hide({ spawn: 'special' });
    	}

    	function click_handler_19() {
    		return dialog$1.show({
    	      component: Content,
    	      title: 'Queued ' + Math.round(1000 * Math.random())
    	    }, { spawn: 'Q', queued: true });
    	}

    	function click_handler_20() {
    		return dialog$1.hide({ spawn: 'Q' });
    	}

    	function click_handler_21() {
    		const $$result = showNotifications = !showNotifications;
    		$$invalidate('showNotifications', showNotifications);
    		return $$result;
    	}

    	function click_handler_22() {
    	      const title = 'N ' + getRandomNumber();
    	      notification$1.show(
    	        {
    	          didShow: id => console.log("didShow", id, title),
    	          didHide: id => console.log("didHide", id, title),
    	          component: Content,
    	          className: "xxx-timings",
    	          showClassName: "xxx-visible-timings",
    	          title
    	        },
    	        {
    	          spawn: 'NO'
    	        }
    	      ).then(id => console.log("notification shown", id, title));}

    	function click_handler_23(e) {
    		return (
    	    notification$1.hide(
    	      {
    	        spawn: 'NO'
    	      }
    	    )).then(id => console.log("notification hidden from App", id));
    	}

    	function click_handler_24() {
    		return notification$1.pause(
    	      {
    	        spawn: 'NO'
    	      }
    	    );
    	}

    	function click_handler_25() {
    		return notification$1.resume(
    	    {
    	      spawn: 'NO'
    	    }
    	  );
    	}

    	let showDialogs, showNotifications;

    	$$invalidate('showDialogs', showDialogs = false);
    	$$invalidate('showNotifications', showNotifications = true);

    	return {
    		dialogCount,
    		notificationCount,
    		getRandomNumber,
    		dialogOneProps,
    		dialogTwoProps,
    		dialogFourProps,
    		clearOptions,
    		Math,
    		showDialogs,
    		showNotifications,
    		$dialogCount,
    		$notificationCount,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5,
    		click_handler_6,
    		click_handler_7,
    		click_handler_8,
    		click_handler_9,
    		click_handler_10,
    		click_handler_11,
    		click_handler_12,
    		click_handler_13,
    		click_handler_14,
    		click_handler_15,
    		click_handler_16,
    		click_handler_17,
    		click_handler_18,
    		click_handler_19,
    		click_handler_20,
    		click_handler_21,
    		click_handler_22,
    		click_handler_23,
    		click_handler_24,
    		click_handler_25
    	};
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$6, safe_not_equal, []);
    	}
    }

    var app = new App({
        target: document.body
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
