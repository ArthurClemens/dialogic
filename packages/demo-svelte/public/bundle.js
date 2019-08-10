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
            return Promise.resolve("no domElement");
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
    const update$1 = stream();
    const states = stream.scan((state, patch) => patch(state), {
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
    const createInstance = (ns) => (defaultSpawnOptions) => (defaultTransitionOptions) => (options = {}, instanceSpawnOptions) => {
        return new Promise(resolve => {
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
            transitionOptions.didShow = item => {
                if (options.didShow) {
                    options.didShow(item);
                }
                return resolve(item);
            };
            transitionOptions.didHide = item => {
                if (options.didHide) {
                    options.didHide(item);
                }
                return resolve(item);
            };
            const uid = getUid().toString();
            const item = {
                ns,
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
                transitionOptions.didShow(item);
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
    const toggle = (ns) => (defaultSpawnOptions) => (defaultTransitionOptions) => (options, instanceSpawnOptions) => {
        const maybeItem = getMaybeItem(ns)(defaultSpawnOptions)(instanceSpawnOptions);
        if (maybeItem.just) {
            return hide(ns)(defaultSpawnOptions)(instanceSpawnOptions);
        }
        else {
            return show(ns)(defaultSpawnOptions)(defaultTransitionOptions)(options, instanceSpawnOptions);
        }
    };
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
    const resume = performOnItem((ns, item, fnOptions = {}) => {
        if (item && item.timer) {
            item.timer.actions.resume(fnOptions.minimumDuration);
        }
        return Promise.resolve(item);
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
    const exists = (ns) => (defaultSpawnOptions) => (instanceSpawnOptions) => {
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
        regularItems.forEach((item) => hideItem(getOverridingTransitionOptions(item, options)));
        if (queuedItems.length > 0) {
            const [current,] = queuedItems;
            // Make sure that any remaining items don't suddenly appear
            actions.store(ns, [current]);
            // Transition the current item
            hideItem(getOverridingTransitionOptions(current, options))
                .then(() => actions.removeAll(ns));
        }
    };
    const getCount = (ns) => (instanceSpawnOptions) => selectors.getCount(ns, instanceSpawnOptions);
    const transitionItem = (item, mode) => {
        return transition({
            ...item.instanceTransitionOptions,
            ...item.transitionOptions,
        }, mode);
    };
    const deferredHideItem = async function (item, timer, timeout) {
        timer.actions.start(() => (hideItem(item)), timeout);
        return getTimerProperty("getResultPromise");
    };
    const showItem = async function (item) {
        await (transitionItem(item, MODE.SHOW));
        item.transitionOptions.didShow && await (item.transitionOptions.didShow(item));
        if (item.transitionOptions.timeout && item.timer) {
            await (deferredHideItem(item, item.timer, item.transitionOptions.timeout));
        }
        return Promise.resolve(item);
    };
    const hideItem = async function (item) {
        // Stop any running timer
        if (item.timer) {
            item.timer.actions.stop();
        }
        await (transitionItem(item, MODE.HIDE));
        item.transitionOptions.didHide && await (item.transitionOptions.didHide(item));
        const copy = JSON.parse(JSON.stringify(item));
        actions.remove(item.ns, item.id);
        return Promise.resolve(copy);
    };

    const dialogical = ({ ns, queued, timeout }) => {
        const defaultId = `default_${ns}`;
        const defaultSpawn = `default_${ns}`;
        const defaultSpawnOptions = {
            id: defaultId,
            spawn: defaultSpawn,
            ...(queued && { queued })
        };
        const defaultTransitionOptions = {
            ...(timeout !== undefined && { timeout })
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
            toggle: toggle(ns)(defaultSpawnOptions)(defaultTransitionOptions),
            hide: hide(ns)(defaultSpawnOptions),
            hideAll: hideAll(ns)(defaultSpawnOptions),
            resetAll: resetAll(ns),
            // Timer commands
            pause: pause(ns)(defaultSpawnOptions),
            resume: resume(ns)(defaultSpawnOptions),
            // State
            exists: exists(ns)(defaultSpawnOptions),
            getCount: getCount(ns),
            // Timer state
            isPaused: isPaused(ns)(defaultSpawnOptions),
            getRemaining: getRemaining$1(ns)(defaultSpawnOptions),
        };
    };

    const dialog = dialogical({ ns: "dialog" });

    const notification = dialogical({ ns: "notification", queued: true, timeout: 3000 });

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

    const getCount$1 = ns => instanceSpawnOptions => derived(
    	appState,
    	() => selectors.getCount(ns, instanceSpawnOptions)
    );

    const isPaused$1 = ns => defaultSpawnOptions => instanceSpawnOptions => derived(
    	appState,
    	() => getTimerProperty("isPaused")(ns)(defaultSpawnOptions)(instanceSpawnOptions)
    );

    const exists$1 = ns => defaultSpawnOptions => instanceSpawnOptions => derived(
    	appState,
    	() => exists(ns)(defaultSpawnOptions)(instanceSpawnOptions)
    );

    const dialog$1 = {
      ...dialog,
      getCount: instanceSpawnOptions =>
        getCount$1(dialog.ns)(instanceSpawnOptions),
      isPaused: instanceSpawnOptions =>
        isPaused$1(dialog.ns)(dialog.defaultSpawnOptions)(instanceSpawnOptions),
      exists: instanceSpawnOptions =>
        exists$1(dialog.ns)(dialog.defaultSpawnOptions)(instanceSpawnOptions),
    };

    const notification$1 = {
      ...notification,
      getCount: instanceSpawnOptions =>
        getCount$1(notification.ns)(instanceSpawnOptions),
      isPaused: instanceSpawnOptions =>
        isPaused$1(notification.ns)(notification.defaultSpawnOptions)(instanceSpawnOptions),
      exists: instanceSpawnOptions =>
        exists$1(notification.ns)(notification.defaultSpawnOptions)(instanceSpawnOptions),
    };

    const handleDispatch = (ns) => (event, fn) => {
      // Update dispatching item:
      const maybeItem = selectors.find(ns, event.detail.spawnOptions);
      if (maybeItem.just) {
        maybeItem.just.instanceTransitionOptions = event.detail.transitionOptions;
      }
      // Find item to transition:
      const maybeTransitioningItem = selectors.find(ns, event.detail.spawnOptions);
      if (maybeTransitioningItem.just) {
        fn(maybeTransitioningItem.just);
      }
    };

    const onInstanceMounted = (ns) => (event) =>
      handleDispatch(ns)(event, showItem);
      
    const onShowInstance = (ns) => (event) =>
      handleDispatch(ns)(event, showItem);

    const onHideInstance = (ns) => (event) =>
      handleDispatch(ns)(event, hideItem);

    /* Users/arthur/code/Github Projects/dialogic/master/packages/dialogic-svelte/src/Instance.svelte generated by Svelte v3.6.11 */

    const file = "Users/arthur/code/Github Projects/dialogic/master/packages/dialogic-svelte/src/Instance.svelte";

    function create_fragment(ctx) {
    	var div, current;

    	var switch_instance_spread_levels = [
    		{ show: ctx.show },
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
    			var switch_instance_changes = (changed.show || changed.hide || changed.instanceOptions) ? get_spread_update(switch_instance_spread_levels, [
    				(changed.show) && { show: ctx.show },
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

      const show = () => {
        dispatchTransition("show");
      };

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
    		show,
    		hide,
    		R_classNames,
    		elementProps,
    		div_binding
    	};
    }

    class Instance extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, ["spawnOptions", "instanceOptions", "transitionOptions"]);
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

    /* Users/arthur/code/Github Projects/dialogic/master/packages/dialogic-svelte/src/Wrapper.svelte generated by Svelte v3.6.11 */

    function get_each_context(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.spawnOptions = list[i].spawnOptions;
    	child_ctx.transitionOptions = list[i].transitionOptions;
    	child_ctx.instanceOptions = list[i].instanceOptions;
    	child_ctx.key = list[i].key;
    	child_ctx.index = i;
    	return child_ctx;
    }

    // (17:0) {#each filterCandidates(ns, $appState.store, spawnOptions) as { spawnOptions, transitionOptions, instanceOptions, key }
    function create_each_block(key_1, ctx) {
    	var first, current;

    	var instance = new Instance({
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
    			if (changed.filterCandidates || changed.ns || changed.$appState || changed.spawnOptions) instance_changes.spawnOptions = ctx.spawnOptions;
    			if (changed.filterCandidates || changed.ns || changed.$appState || changed.spawnOptions) instance_changes.transitionOptions = ctx.transitionOptions;
    			if (changed.filterCandidates || changed.ns || changed.$appState || changed.spawnOptions) instance_changes.instanceOptions = ctx.instanceOptions;
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

    function create_fragment$1(ctx) {
    	var each_blocks = [], each_1_lookup = new Map(), each_1_anchor, current;

    	var each_value = filterCandidates(ctx.ns, ctx.$appState.store, ctx.spawnOptions);

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
    			const each_value = filterCandidates(ctx.ns, ctx.$appState.store, ctx.spawnOptions);

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

    	

      let { spawnOptions, ns } = $$props;

      const nsOnInstanceMounted = onInstanceMounted(ns);
      const nsOnShowInstance = onShowInstance(ns);
      const nsOnHideInstance = onHideInstance(ns);

    	const writable_props = ['spawnOptions', 'ns'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Wrapper> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('spawnOptions' in $$props) $$invalidate('spawnOptions', spawnOptions = $$props.spawnOptions);
    		if ('ns' in $$props) $$invalidate('ns', ns = $$props.ns);
    	};

    	return {
    		spawnOptions,
    		ns,
    		nsOnInstanceMounted,
    		nsOnShowInstance,
    		nsOnHideInstance,
    		$appState
    	};
    }

    class Wrapper extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance_1, create_fragment$1, safe_not_equal, ["spawnOptions", "ns"]);

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.spawnOptions === undefined && !('spawnOptions' in props)) {
    			console.warn("<Wrapper> was created without expected prop 'spawnOptions'");
    		}
    		if (ctx.ns === undefined && !('ns' in props)) {
    			console.warn("<Wrapper> was created without expected prop 'ns'");
    		}
    	}

    	get spawnOptions() {
    		throw new Error("<Wrapper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spawnOptions(value) {
    		throw new Error("<Wrapper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ns() {
    		throw new Error("<Wrapper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ns(value) {
    		throw new Error("<Wrapper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* Users/arthur/code/Github Projects/dialogic/master/packages/dialogic-svelte/src/Dialogical.svelte generated by Svelte v3.6.11 */

    function create_fragment$2(ctx) {
    	var current;

    	var wrapper = new Wrapper({
    		props: {
    		spawnOptions: ctx.spawnOptions,
    		ns: ctx.ns
    	},
    		$$inline: true
    	});

    	return {
    		c: function create() {
    			wrapper.$$.fragment.c();
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			mount_component(wrapper, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var wrapper_changes = {};
    			if (changed.spawnOptions) wrapper_changes.spawnOptions = ctx.spawnOptions;
    			if (changed.ns) wrapper_changes.ns = ctx.ns;
    			wrapper.$set(wrapper_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(wrapper.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(wrapper.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(wrapper, detaching);
    		}
    	};
    }

    function instance$1($$self, $$props, $$invalidate) {
    	

      let { type, ns = type.ns, spawn = undefined, id = undefined, onMount: onMount$1 = undefined } = $$props;

      const spawnOptions = {
        id: id || type.defaultId,
        spawn: spawn || type.defaultSpawn,
      };

      onMount(() => {
        if (typeof onMount$1 === "function") {
          onMount$1();
        }
      });

    	const writable_props = ['type', 'ns', 'spawn', 'id', 'onMount'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Dialogical> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('type' in $$props) $$invalidate('type', type = $$props.type);
    		if ('ns' in $$props) $$invalidate('ns', ns = $$props.ns);
    		if ('spawn' in $$props) $$invalidate('spawn', spawn = $$props.spawn);
    		if ('id' in $$props) $$invalidate('id', id = $$props.id);
    		if ('onMount' in $$props) $$invalidate('onMount', onMount$1 = $$props.onMount);
    	};

    	return {
    		type,
    		ns,
    		spawn,
    		id,
    		onMount: onMount$1,
    		spawnOptions
    	};
    }

    class Dialogical extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$2, safe_not_equal, ["type", "ns", "spawn", "id", "onMount"]);

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.type === undefined && !('type' in props)) {
    			console.warn("<Dialogical> was created without expected prop 'type'");
    		}
    	}

    	get type() {
    		throw new Error("<Dialogical>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Dialogical>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ns() {
    		throw new Error("<Dialogical>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ns(value) {
    		throw new Error("<Dialogical>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get spawn() {
    		throw new Error("<Dialogical>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spawn(value) {
    		throw new Error("<Dialogical>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<Dialogical>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Dialogical>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onMount() {
    		throw new Error("<Dialogical>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onMount(value) {
    		throw new Error("<Dialogical>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* Users/arthur/code/Github Projects/dialogic/master/packages/dialogic-svelte/src/Dialog.svelte generated by Svelte v3.6.11 */

    function create_fragment$3(ctx) {
    	var current;

    	var dialogical_spread_levels = [
    		ctx.$$props,
    		{ type: dialog$1 }
    	];

    	let dialogical_props = {};
    	for (var i = 0; i < dialogical_spread_levels.length; i += 1) {
    		dialogical_props = assign(dialogical_props, dialogical_spread_levels[i]);
    	}
    	var dialogical = new Dialogical({ props: dialogical_props, $$inline: true });

    	return {
    		c: function create() {
    			dialogical.$$.fragment.c();
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			mount_component(dialogical, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var dialogical_changes = (changed.$$props || changed.dialog) ? get_spread_update(dialogical_spread_levels, [
    				(changed.$$props) && ctx.$$props,
    				(changed.dialog) && { type: dialog$1 }
    			]) : {};
    			dialogical.$set(dialogical_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(dialogical.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(dialogical.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(dialogical, detaching);
    		}
    	};
    }

    function instance$2($$self, $$props, $$invalidate) {
    	$$self.$set = $$new_props => {
    		$$invalidate('$$props', $$props = assign(assign({}, $$props), $$new_props));
    	};

    	return {
    		$$props,
    		$$props: $$props = exclude_internal_props($$props)
    	};
    }

    class Dialog extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$3, safe_not_equal, []);
    	}
    }

    /* Users/arthur/code/Github Projects/dialogic/master/packages/dialogic-svelte/src/Notification.svelte generated by Svelte v3.6.11 */

    function create_fragment$4(ctx) {
    	var current;

    	var dialogical_spread_levels = [
    		ctx.$$props,
    		{ type: notification$1 }
    	];

    	let dialogical_props = {};
    	for (var i = 0; i < dialogical_spread_levels.length; i += 1) {
    		dialogical_props = assign(dialogical_props, dialogical_spread_levels[i]);
    	}
    	var dialogical = new Dialogical({ props: dialogical_props, $$inline: true });

    	return {
    		c: function create() {
    			dialogical.$$.fragment.c();
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			mount_component(dialogical, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var dialogical_changes = (changed.$$props || changed.notification) ? get_spread_update(dialogical_spread_levels, [
    				(changed.$$props) && ctx.$$props,
    				(changed.notification) && { type: notification$1 }
    			]) : {};
    			dialogical.$set(dialogical_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(dialogical.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(dialogical.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(dialogical, detaching);
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

    class Notification extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$4, safe_not_equal, []);
    	}
    }

    /* src/default/Content.svelte generated by Svelte v3.6.11 */

    const file$1 = "src/default/Content.svelte";

    function create_fragment$5(ctx) {
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

    function instance$4($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$4, create_fragment$5, safe_not_equal, []);
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

    function create_fragment$6(ctx) {
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

    function instance$5($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$5, create_fragment$6, safe_not_equal, []);
    	}
    }

    /* src/remaining/Remaining.svelte generated by Svelte v3.6.11 */

    const file$3 = "src/remaining/Remaining.svelte";

    function create_fragment$7(ctx) {
    	var div, t0, t1;

    	return {
    		c: function create() {
    			div = element("div");
    			t0 = text("Remaining: ");
    			t1 = text(ctx.displayValue);
    			add_location(div, file$3, 22, 0, 437);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);
    			append(div, t0);
    			append(div, t1);
    		},

    		p: function update_1(changed, ctx) {
    			if (changed.displayValue) {
    				set_data(t1, ctx.displayValue);
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}
    		}
    	};
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { getRemainingFn } = $$props;
    	
    	let displayValue = 0;
    	let reqId;
    	
      const update = () => {
        const value = getRemainingFn();
        $$invalidate('displayValue', displayValue = value === undefined
          ? undefined
          : Math.max(value, 0));
        reqId = window.requestAnimationFrame(update);
      };
    	reqId = window.requestAnimationFrame(update);
    	
    	onDestroy(() => {
    		window.cancelAnimationFrame(reqId);
    	});

    	const writable_props = ['getRemainingFn'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Remaining> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('getRemainingFn' in $$props) $$invalidate('getRemainingFn', getRemainingFn = $$props.getRemainingFn);
    	};

    	return { getRemainingFn, displayValue };
    }

    class Remaining extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$7, safe_not_equal, ["getRemainingFn"]);

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.getRemainingFn === undefined && !('getRemainingFn' in props)) {
    			console.warn("<Remaining> was created without expected prop 'getRemainingFn'");
    		}
    	}

    	get getRemainingFn() {
    		throw new Error("<Remaining>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getRemainingFn(value) {
    		throw new Error("<Remaining>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.6.11 */

    const file$4 = "src/App.svelte";

    // (131:0) {#if showDialogs}
    function create_if_block_1(ctx) {
    	var h2, t1, p0, t2, t3, t4, hr0, t5, div0, button0, t7, button1, t9, div1, t10, button2, t12, button3, t14, button4, t16, button5, t18, div2, button6, t20, button7, t22, div3, button8, t24, button9, t26, div4, button10, t28, button11, t30, div5, button12, t32, button13, t34, div6, button14, t36, button15, t38, hr1, t39, div7, p1, t41, t42, div8, p2, t44, t45, hr2, t46, div9, button16, t48, button17, t50, div10, p3, t52, t53, hr3, t54, div11, button18, t56, button19, t58, div12, current, dispose;

    	var if_block = (ctx.$timerDialogDisplayed) && create_if_block_2(ctx);

    	var dialog0 = new Dialog({ $$inline: true });

    	var dialog1 = new Dialog({
    		props: { spawn: "special" },
    		$$inline: true
    	});

    	var dialog2 = new Dialog({ props: { spawn: "Q" }, $$inline: true });

    	var dialog3 = new Dialog({
    		props: { spawn: "initial", onMount: ctx.func_1 },
    		$$inline: true
    	});

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
    			if (if_block) if_block.c();
    			t10 = space();
    			button2 = element("button");
    			button2.textContent = "With timer";
    			t12 = space();
    			button3 = element("button");
    			button3.textContent = "Pause";
    			t14 = space();
    			button4 = element("button");
    			button4.textContent = "Resume";
    			t16 = space();
    			button5 = element("button");
    			button5.textContent = "Hide";
    			t18 = space();
    			div2 = element("div");
    			button6 = element("button");
    			button6.textContent = "Show with promises";
    			t20 = space();
    			button7 = element("button");
    			button7.textContent = "Hide";
    			t22 = space();
    			div3 = element("div");
    			button8 = element("button");
    			button8.textContent = "Show delay";
    			t24 = space();
    			button9 = element("button");
    			button9.textContent = "Hide";
    			t26 = space();
    			div4 = element("div");
    			button10 = element("button");
    			button10.textContent = "Show slow fade";
    			t28 = space();
    			button11 = element("button");
    			button11.textContent = "Hide";
    			t30 = space();
    			div5 = element("div");
    			button12 = element("button");
    			button12.textContent = "Show transition";
    			t32 = space();
    			button13 = element("button");
    			button13.textContent = "Hide";
    			t34 = space();
    			div6 = element("div");
    			button14 = element("button");
    			button14.textContent = "Show default in spawn";
    			t36 = space();
    			button15 = element("button");
    			button15.textContent = "Hide";
    			t38 = space();
    			hr1 = element("hr");
    			t39 = space();
    			div7 = element("div");
    			p1 = element("p");
    			p1.textContent = "Dialog:";
    			t41 = space();
    			dialog0.$$.fragment.c();
    			t42 = space();
    			div8 = element("div");
    			p2 = element("p");
    			p2.textContent = "Dialog with spawn:";
    			t44 = space();
    			dialog1.$$.fragment.c();
    			t45 = space();
    			hr2 = element("hr");
    			t46 = text("\nQueued dialog\n");
    			div9 = element("div");
    			button16 = element("button");
    			button16.textContent = "Queued";
    			t48 = space();
    			button17 = element("button");
    			button17.textContent = "Hide";
    			t50 = space();
    			div10 = element("div");
    			p3 = element("p");
    			p3.textContent = "Dialog queued:";
    			t52 = space();
    			dialog2.$$.fragment.c();
    			t53 = space();
    			hr3 = element("hr");
    			t54 = text("\nInitially shown dialog\n");
    			div11 = element("div");
    			button18 = element("button");
    			button18.textContent = "Initially shown";
    			t56 = space();
    			button19 = element("button");
    			button19.textContent = "Hide";
    			t58 = space();
    			div12 = element("div");
    			dialog3.$$.fragment.c();
    			add_location(h2, file$4, 132, 0, 3182);
    			add_location(p0, file$4, 134, 0, 3199);
    			add_location(hr0, file$4, 136, 0, 3238);
    			add_location(button0, file$4, 139, 2, 3254);
    			add_location(button1, file$4, 146, 2, 3387);
    			add_location(div0, file$4, 138, 0, 3246);
    			add_location(button2, file$4, 157, 2, 3584);
    			add_location(button3, file$4, 169, 2, 3797);
    			add_location(button4, file$4, 174, 2, 3895);
    			add_location(button5, file$4, 182, 2, 4028);
    			add_location(div1, file$4, 149, 0, 3448);
    			add_location(button6, file$4, 186, 2, 4147);
    			add_location(button7, file$4, 202, 2, 4567);
    			add_location(div2, file$4, 185, 0, 4139);
    			add_location(button8, file$4, 209, 2, 4721);
    			add_location(button9, file$4, 218, 2, 4950);
    			add_location(div3, file$4, 208, 0, 4713);
    			add_location(button10, file$4, 221, 2, 5043);
    			add_location(button11, file$4, 225, 2, 5161);
    			add_location(div4, file$4, 220, 0, 5035);
    			add_location(button12, file$4, 228, 2, 5254);
    			add_location(button13, file$4, 232, 2, 5375);
    			add_location(div5, file$4, 227, 0, 5246);
    			add_location(button14, file$4, 235, 2, 5469);
    			add_location(button15, file$4, 242, 2, 5643);
    			add_location(div6, file$4, 234, 0, 5461);
    			add_location(hr1, file$4, 245, 0, 5724);
    			add_location(p1, file$4, 248, 2, 5740);
    			add_location(div7, file$4, 247, 0, 5732);
    			add_location(p2, file$4, 253, 2, 5784);
    			add_location(div8, file$4, 252, 0, 5776);
    			add_location(hr2, file$4, 257, 0, 5847);
    			add_location(button16, file$4, 260, 2, 5876);
    			add_location(button17, file$4, 267, 2, 6073);
    			add_location(div9, file$4, 259, 0, 5868);
    			add_location(p3, file$4, 271, 2, 6156);
    			add_location(div10, file$4, 270, 0, 6148);
    			add_location(hr3, file$4, 275, 0, 6209);
    			add_location(button18, file$4, 278, 2, 6247);
    			add_location(button19, file$4, 282, 2, 6325);
    			add_location(div11, file$4, 277, 0, 6239);
    			add_location(div12, file$4, 285, 0, 6406);

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
    				listen(button15, "click", ctx.click_handler_20),
    				listen(button16, "click", ctx.click_handler_21),
    				listen(button17, "click", ctx.click_handler_22),
    				listen(button18, "click", ctx.click_handler_23),
    				listen(button19, "click", ctx.click_handler_24)
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
    			if (if_block) if_block.m(div1, null);
    			append(div1, t10);
    			append(div1, button2);
    			append(div1, t12);
    			append(div1, button3);
    			append(div1, t14);
    			append(div1, button4);
    			append(div1, t16);
    			append(div1, button5);
    			insert(target, t18, anchor);
    			insert(target, div2, anchor);
    			append(div2, button6);
    			append(div2, t20);
    			append(div2, button7);
    			insert(target, t22, anchor);
    			insert(target, div3, anchor);
    			append(div3, button8);
    			append(div3, t24);
    			append(div3, button9);
    			insert(target, t26, anchor);
    			insert(target, div4, anchor);
    			append(div4, button10);
    			append(div4, t28);
    			append(div4, button11);
    			insert(target, t30, anchor);
    			insert(target, div5, anchor);
    			append(div5, button12);
    			append(div5, t32);
    			append(div5, button13);
    			insert(target, t34, anchor);
    			insert(target, div6, anchor);
    			append(div6, button14);
    			append(div6, t36);
    			append(div6, button15);
    			insert(target, t38, anchor);
    			insert(target, hr1, anchor);
    			insert(target, t39, anchor);
    			insert(target, div7, anchor);
    			append(div7, p1);
    			append(div7, t41);
    			mount_component(dialog0, div7, null);
    			insert(target, t42, anchor);
    			insert(target, div8, anchor);
    			append(div8, p2);
    			append(div8, t44);
    			mount_component(dialog1, div8, null);
    			insert(target, t45, anchor);
    			insert(target, hr2, anchor);
    			insert(target, t46, anchor);
    			insert(target, div9, anchor);
    			append(div9, button16);
    			append(div9, t48);
    			append(div9, button17);
    			insert(target, t50, anchor);
    			insert(target, div10, anchor);
    			append(div10, p3);
    			append(div10, t52);
    			mount_component(dialog2, div10, null);
    			insert(target, t53, anchor);
    			insert(target, hr3, anchor);
    			insert(target, t54, anchor);
    			insert(target, div11, anchor);
    			append(div11, button18);
    			append(div11, t56);
    			append(div11, button19);
    			insert(target, t58, anchor);
    			insert(target, div12, anchor);
    			mount_component(dialog3, div12, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (!current || changed.$dialogCount) {
    				set_data(t3, ctx.$dialogCount);
    			}

    			if (ctx.$timerDialogDisplayed) {
    				if (if_block) {
    					if_block.p(changed, ctx);
    					transition_in(if_block, 1);
    				} else {
    					if_block = create_if_block_2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div1, t10);
    				}
    			} else if (if_block) {
    				group_outros();
    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});
    				check_outros();
    			}

    			var dialog3_changes = {};
    			if (changed.showInitial) dialog3_changes.onMount = ctx.func_1;
    			dialog3.$set(dialog3_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);

    			transition_in(dialog0.$$.fragment, local);

    			transition_in(dialog1.$$.fragment, local);

    			transition_in(dialog2.$$.fragment, local);

    			transition_in(dialog3.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(dialog0.$$.fragment, local);
    			transition_out(dialog1.$$.fragment, local);
    			transition_out(dialog2.$$.fragment, local);
    			transition_out(dialog3.$$.fragment, local);
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
    			}

    			if (if_block) if_block.d();

    			if (detaching) {
    				detach(t18);
    				detach(div2);
    				detach(t22);
    				detach(div3);
    				detach(t26);
    				detach(div4);
    				detach(t30);
    				detach(div5);
    				detach(t34);
    				detach(div6);
    				detach(t38);
    				detach(hr1);
    				detach(t39);
    				detach(div7);
    			}

    			destroy_component(dialog0);

    			if (detaching) {
    				detach(t42);
    				detach(div8);
    			}

    			destroy_component(dialog1);

    			if (detaching) {
    				detach(t45);
    				detach(hr2);
    				detach(t46);
    				detach(div9);
    				detach(t50);
    				detach(div10);
    			}

    			destroy_component(dialog2);

    			if (detaching) {
    				detach(t53);
    				detach(hr3);
    				detach(t54);
    				detach(div11);
    				detach(t58);
    				detach(div12);
    			}

    			destroy_component(dialog3);

    			run_all(dispose);
    		}
    	};
    }

    // (152:2) {#if $timerDialogDisplayed}
    function create_if_block_2(ctx) {
    	var current;

    	var remaining = new Remaining({
    		props: { getRemainingFn: ctx.func },
    		$$inline: true
    	});

    	return {
    		c: function create() {
    			remaining.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(remaining, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var remaining_changes = {};
    			if (changed.dialog) remaining_changes.getRemainingFn = ctx.func;
    			remaining.$set(remaining_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(remaining.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(remaining.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(remaining, detaching);
    		}
    	};
    }

    // (298:0) {#if showNotifications}
    function create_if_block(ctx) {
    	var h2, t1, p0, t2, t3, t4, p1, t5, t6, t7, p2, t8, t9, t10, div, button0, t12, button1, t14, button2, t16, button3, t18, t19, hr, current, dispose;

    	var notification_1 = new Notification({ props: { spawn: "NO" }, $$inline: true });

    	return {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "Notification";
    			t1 = space();
    			p0 = element("p");
    			t2 = text("Notification count: ");
    			t3 = text(ctx.$notificationCount);
    			t4 = space();
    			p1 = element("p");
    			t5 = text("Notification displayed: ");
    			t6 = text(ctx.$notificationDisplayed);
    			t7 = space();
    			p2 = element("p");
    			t8 = text("Is paused: ");
    			t9 = text(ctx.$notificationItemIsPaused);
    			t10 = space();
    			div = element("div");
    			button0 = element("button");
    			button0.textContent = "Queued";
    			t12 = space();
    			button1 = element("button");
    			button1.textContent = "Hide";
    			t14 = space();
    			button2 = element("button");
    			button2.textContent = "Pause";
    			t16 = space();
    			button3 = element("button");
    			button3.textContent = "Resume";
    			t18 = space();
    			notification_1.$$.fragment.c();
    			t19 = space();
    			hr = element("hr");
    			add_location(h2, file$4, 299, 0, 6641);
    			add_location(p0, file$4, 300, 0, 6663);
    			add_location(p1, file$4, 301, 0, 6712);
    			add_location(p2, file$4, 302, 0, 6769);
    			add_location(button0, file$4, 305, 2, 6825);
    			add_location(button1, file$4, 325, 2, 7357);
    			add_location(button2, file$4, 331, 2, 7529);
    			add_location(button3, file$4, 336, 2, 7633);
    			add_location(div, file$4, 304, 0, 6817);
    			add_location(hr, file$4, 345, 0, 7766);

    			dispose = [
    				listen(button0, "click", ctx.click_handler_26),
    				listen(button1, "click", ctx.click_handler_27),
    				listen(button2, "click", ctx.click_handler_28),
    				listen(button3, "click", ctx.click_handler_29)
    			];
    		},

    		m: function mount(target, anchor) {
    			insert(target, h2, anchor);
    			insert(target, t1, anchor);
    			insert(target, p0, anchor);
    			append(p0, t2);
    			append(p0, t3);
    			insert(target, t4, anchor);
    			insert(target, p1, anchor);
    			append(p1, t5);
    			append(p1, t6);
    			insert(target, t7, anchor);
    			insert(target, p2, anchor);
    			append(p2, t8);
    			append(p2, t9);
    			insert(target, t10, anchor);
    			insert(target, div, anchor);
    			append(div, button0);
    			append(div, t12);
    			append(div, button1);
    			append(div, t14);
    			append(div, button2);
    			append(div, t16);
    			append(div, button3);
    			insert(target, t18, anchor);
    			mount_component(notification_1, target, anchor);
    			insert(target, t19, anchor);
    			insert(target, hr, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (!current || changed.$notificationCount) {
    				set_data(t3, ctx.$notificationCount);
    			}

    			if (!current || changed.$notificationDisplayed) {
    				set_data(t6, ctx.$notificationDisplayed);
    			}

    			if (!current || changed.$notificationItemIsPaused) {
    				set_data(t9, ctx.$notificationItemIsPaused);
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
    				detach(p0);
    				detach(t4);
    				detach(p1);
    				detach(t7);
    				detach(p2);
    				detach(t10);
    				detach(div);
    				detach(t18);
    			}

    			destroy_component(notification_1, detaching);

    			if (detaching) {
    				detach(t19);
    				detach(hr);
    			}

    			run_all(dispose);
    		}
    	};
    }

    function create_fragment$8(ctx) {
    	var button0, t1, button1, t3, button2, t5, button3, t7, hr0, t8, button4, t10, t11, hr1, t12, button5, t14, if_block1_anchor, current, dispose;

    	var if_block0 = (ctx.showDialogs) && create_if_block_1(ctx);

    	var if_block1 = (ctx.showNotifications) && create_if_block(ctx);

    	return {
    		c: function create() {
    			button0 = element("button");
    			button0.textContent = "Hide notifications";
    			t1 = space();
    			button1 = element("button");
    			button1.textContent = "Reset notifications";
    			t3 = space();
    			button2 = element("button");
    			button2.textContent = "Hide dialogs";
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
    			add_location(button0, file$4, 118, 0, 2711);
    			add_location(button1, file$4, 120, 0, 2823);
    			add_location(button2, file$4, 122, 0, 2918);
    			add_location(button3, file$4, 124, 0, 2995);
    			add_location(hr0, file$4, 126, 0, 3078);
    			add_location(button4, file$4, 128, 0, 3086);
    			add_location(hr1, file$4, 293, 0, 6513);
    			add_location(button5, file$4, 295, 0, 6521);

    			dispose = [
    				listen(button0, "click", ctx.click_handler),
    				listen(button1, "click", ctx.click_handler_1),
    				listen(button2, "click", ctx.click_handler_2),
    				listen(button3, "click", ctx.click_handler_3),
    				listen(button4, "click", ctx.click_handler_4),
    				listen(button5, "click", ctx.click_handler_25)
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

    function instance$7($$self, $$props, $$invalidate) {
    	let $dialogCount, $timerDialogDisplayed, $notificationCount, $notificationDisplayed, $notificationItemIsPaused;

    	

      const dialogCount = dialog$1.getCount(); validate_store(dialogCount, 'dialogCount'); component_subscribe($$self, dialogCount, $$value => { $dialogCount = $$value; $$invalidate('$dialogCount', $dialogCount); });
      const timerDialogDisplayed = dialog$1.exists({
        id: "timer"
      }); validate_store(timerDialogDisplayed, 'timerDialogDisplayed'); component_subscribe($$self, timerDialogDisplayed, $$value => { $timerDialogDisplayed = $$value; $$invalidate('$timerDialogDisplayed', $timerDialogDisplayed); });

      const notificationCount = notification$1.getCount({
        spawn: "NO"
      }); validate_store(notificationCount, 'notificationCount'); component_subscribe($$self, notificationCount, $$value => { $notificationCount = $$value; $$invalidate('$notificationCount', $notificationCount); });

      const notificationItemIsPaused = notification$1.isPaused({
        spawn: "NO"
      }); validate_store(notificationItemIsPaused, 'notificationItemIsPaused'); component_subscribe($$self, notificationItemIsPaused, $$value => { $notificationItemIsPaused = $$value; $$invalidate('$notificationItemIsPaused', $notificationItemIsPaused); });
      const notificationDisplayed = notification$1.exists({
        spawn: "NO"
      }); validate_store(notificationDisplayed, 'notificationDisplayed'); component_subscribe($$self, notificationDisplayed, $$value => { $notificationDisplayed = $$value; $$invalidate('$notificationDisplayed', $notificationDisplayed); });

      const getRandomId = () => Math.round(1000 * Math.random()).toString();

      const showInitial = ({ isOnMount } = {}) => dialog$1.show(
      {
        title: getRandomId(),
        component: Content,
        showDuration: isOnMount
          ? 0
          : .5,
        hideDuration: 0.5,
        className: "xxx",
        showClassName: "xxx-visible",
      },
      {
        spawn: "initial",
      }
    );

      const dialogOneProps = {
        showDuration: 0.5,
        showDelay: 0.25,
        hideDuration: 0.5,
        hideDelay: .25,
        component: Content$1,
        className: "xxx",
        showClassName: "xxx-visible",
        title: "Clock",
        id: getRandomId()
      };
      const dialogTwoProps = {
        showDuration: 0.75,
        showDelay: 0,
        hideDuration: 0.75,
        hideDelay: 0,
        component: Content,
        className: "xxx",
        showClassName: "xxx-visible",
        title: "Fade",
        id: getRandomId()
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
        title: "Transitions",
        id: getRandomId()
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

    	function func() {
    		return dialog$1.getRemaining({
    	      id: "timer"
    	    });
    	}

    	function click_handler_7() {
    		return dialog$1.show(
    	      {
    	        timeout: 2000,
    	        component: Content,
    	        title: "With timer",
    	      },
    	      {
    	        id: "timer"
    	      });
    	}

    	function click_handler_8() {
    		return dialog$1.pause(
    	      {
    	        id: "timer"
    	      }
    	    );
    	}

    	function click_handler_9() {
    		return dialog$1.resume(
    	    {
    	      id: "timer"
    	    },
    	    {
    	      minimumDuration: 2000
    	    }
    	  );
    	}

    	function click_handler_10() {
    		return dialog$1.hide({ id: "timer" }).catch(() => console.log("caught"));
    	}

    	function click_handler_11() {
    		return dialog$1.show(
    	      {
    	        didShow: item => console.log("didShow", item),
    	        didHide: item => console.log("didHide", item),
    	        showDuration: 0.5,
    	        showDelay: 0.25,
    	        component: Content,
    	        title: "With Promise"
    	      },
    	      {
    	        id: "withPromise"
    	      }
    	    ).then(item => console.log("dialog shown", item));
    	}

    	function click_handler_12() {
    		return dialog$1.hide(
    	    {
    	      id: "withPromise"
    	    }).then(item => console.log("dialog hidden", item));
    	}

    	function click_handler_13() {
    		return dialog$1.show({
    	      ...dialogOneProps,
    	      showDelay: .5,
    	      hideDelay: 0,
    	      title: dialogOneProps.title + " " + getRandomId()
    	    }, { id: dialogOneProps.id });
    	}

    	function click_handler_14() {
    		return dialog$1.hide({ id: dialogOneProps.id });
    	}

    	function click_handler_15() {
    		return dialog$1.show(dialogTwoProps, { id: dialogTwoProps.id });
    	}

    	function click_handler_16() {
    		return dialog$1.hide({ id: dialogTwoProps.id });
    	}

    	function click_handler_17() {
    		return dialog$1.show(dialogFourProps, { id: dialogFourProps.id });
    	}

    	function click_handler_18() {
    		return dialog$1.hide({ id: dialogFourProps.id });
    	}

    	function click_handler_19() {
    		return dialog$1.show({
    	      component: Content,
    	      title: "Custom spawn"
    	    }, { spawn: "special" });
    	}

    	function click_handler_20() {
    		return dialog$1.hide({ spawn: "special" });
    	}

    	function click_handler_21() {
    		return dialog$1.show({
    	      component: Content,
    	      title: "Queued " + Math.round(1000 * Math.random())
    	    }, { spawn: "Q", queued: true });
    	}

    	function click_handler_22() {
    		return dialog$1.hide({ spawn: "Q" });
    	}

    	function click_handler_23() {
    		return showInitial();
    	}

    	function click_handler_24() {
    		return dialog$1.hide({ spawn: "initial" });
    	}

    	function func_1() {
    		return showInitial({ isOnMount: true });
    	}

    	function click_handler_25() {
    		const $$result = showNotifications = !showNotifications;
    		$$invalidate('showNotifications', showNotifications);
    		return $$result;
    	}

    	function click_handler_26() {
    	      const title = "N " + getRandomId();
    	      notification$1.show(
    	        {
    	          didShow: item => console.log("didShow", item, title),
    	          didHide: item => console.log("didHide", item, title),
    	          component: Content,
    	          className: "xxx-timings",
    	          showClassName: "xxx-visible-timings",
    	          title
    	        },
    	        {
    	          spawn: "NO"
    	        }
    	      ).then(item => console.log("notification shown", item, title));}

    	function click_handler_27(e) {
    		return (
    	    notification$1.hide(
    	      {
    	        spawn: "NO"
    	      }
    	    )).then(item => console.log("notification hidden from App", item));
    	}

    	function click_handler_28() {
    		return notification$1.pause(
    	      {
    	        spawn: "NO"
    	      }
    	    );
    	}

    	function click_handler_29() {
    		return notification$1.resume(
    	    {
    	      spawn: "NO"
    	    }
    	  );
    	}

    	let showDialogs, showNotifications;

    	$$invalidate('showDialogs', showDialogs = true);
    	$$invalidate('showNotifications', showNotifications = false);

    	return {
    		dialogCount,
    		timerDialogDisplayed,
    		notificationCount,
    		notificationItemIsPaused,
    		notificationDisplayed,
    		getRandomId,
    		showInitial,
    		dialogOneProps,
    		dialogTwoProps,
    		dialogFourProps,
    		clearOptions,
    		Math,
    		showDialogs,
    		showNotifications,
    		$dialogCount,
    		$timerDialogDisplayed,
    		$notificationCount,
    		$notificationDisplayed,
    		$notificationItemIsPaused,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5,
    		click_handler_6,
    		func,
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
    		func_1,
    		click_handler_25,
    		click_handler_26,
    		click_handler_27,
    		click_handler_28,
    		click_handler_29
    	};
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$8, safe_not_equal, []);
    	}
    }

    var app = new App({
        target: document.body
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
