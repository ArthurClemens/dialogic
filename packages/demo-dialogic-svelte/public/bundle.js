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
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
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
        const component = get_current_component();
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
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
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
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
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
                block.p(child_ctx, dirty);
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
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
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
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
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
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, value = ret) => {
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(children(options.target));
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
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

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, detail));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
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
        callback: () => { },
        isPaused: false,
        onAbort: () => { },
        onDone: () => { },
        promise: undefined,
        remaining: 0,
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
    const getRemaining = (state) => state.remaining === 0
        ? 0
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
    const getRemaining$1 = getTimerProperty("getRemaining", 0);
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

    const getCount$1 = ns => identityOptions => derived(
    	appState,
    	() => selectors.getCount(ns, identityOptions)
    );

    const isPaused$1 = ns => defaultDialogicOptions => identityOptions => derived(
    	appState,
    	() => isPaused(ns)(defaultDialogicOptions)(identityOptions)
    );

    const exists$1 = ns => defaultDialogicOptions => identityOptions => derived(
    	appState,
    	() => exists(ns)(defaultDialogicOptions)(identityOptions)
    );

    const dialog$1 = {
      ...dialog,
      getCount: identityOptions =>
        getCount$1(dialog.ns)(identityOptions),
      isPaused: identityOptions =>
        isPaused$1(dialog.ns)(dialog.defaultDialogicOptions)(identityOptions),
      exists: identityOptions =>
        exists$1(dialog.ns)(dialog.defaultDialogicOptions)(identityOptions),
    };

    const notification$1 = {
      ...notification,
      getCount: identityOptions =>
        getCount$1(notification.ns)(identityOptions),
      isPaused: identityOptions =>
        isPaused$1(notification.ns)(notification.defaultDialogicOptions)(identityOptions),
      exists: identityOptions =>
        exists$1(notification.ns)(notification.defaultDialogicOptions)(identityOptions),
    };

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

    const onInstanceMounted = (ns) => (event) =>
      handleDispatch(ns)(event, showItem);
      
    const onShowInstance = (ns) => (event) =>
      handleDispatch(ns)(event, showItem);

    const onHideInstance = (ns) => (event) =>
      handleDispatch(ns)(event, hideItem);

    /* Users/arthur/code/Github Projects/dialogic/master/packages/dialogic-svelte/src/Instance.svelte generated by Svelte v3.16.5 */
    const file = "Users/arthur/code/Github Projects/dialogic/master/packages/dialogic-svelte/src/Instance.svelte";

    function create_fragment(ctx) {
    	let div;
    	let current;

    	const switch_instance_spread_levels = [
    		{ show: /*show*/ ctx[4] },
    		{ hide: /*hide*/ ctx[5] },
    		/*passThroughOptions*/ ctx[0]
    	];

    	var switch_value = /*dialogicOptions*/ ctx[1].component;

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
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

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			attr_dev(div, "class", /*className*/ ctx[3]);
    			add_location(div, file, 34, 0, 616);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (switch_instance) {
    				mount_component(switch_instance, div, null);
    			}

    			/*div_binding*/ ctx[9](div);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const switch_instance_changes = (dirty & /*show, hide, passThroughOptions*/ 49)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*show*/ 16 && ({ show: /*show*/ ctx[4] }),
    					dirty & /*hide*/ 32 && ({ hide: /*hide*/ ctx[5] }),
    					dirty & /*passThroughOptions*/ 1 && get_spread_object(/*passThroughOptions*/ ctx[0])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*dialogicOptions*/ ctx[1].component)) {
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
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, div, null);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
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
    			if (detaching) detach_dev(div);
    			if (switch_instance) destroy_component(switch_instance);
    			/*div_binding*/ ctx[9](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	const dispatch = createEventDispatcher();
    	let domElement;
    	let { identityOptions } = $$props;
    	let { passThroughOptions } = $$props;
    	let { dialogicOptions } = $$props;
    	const className = dialogicOptions ? dialogicOptions.className : "";
    	const dispatchTransition = name => dispatch(name, { identityOptions, domElement });

    	const show = () => {
    		dispatchTransition("show");
    	};

    	const hide = () => {
    		dispatchTransition("hide");
    	};

    	onMount(() => {
    		dispatchTransition("mount");
    	});

    	const writable_props = ["identityOptions", "passThroughOptions", "dialogicOptions"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Instance> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			$$invalidate(2, domElement = $$value);
    		});
    	}

    	$$self.$set = $$props => {
    		if ("identityOptions" in $$props) $$invalidate(6, identityOptions = $$props.identityOptions);
    		if ("passThroughOptions" in $$props) $$invalidate(0, passThroughOptions = $$props.passThroughOptions);
    		if ("dialogicOptions" in $$props) $$invalidate(1, dialogicOptions = $$props.dialogicOptions);
    	};

    	$$self.$capture_state = () => {
    		return {
    			domElement,
    			identityOptions,
    			passThroughOptions,
    			dialogicOptions
    		};
    	};

    	$$self.$inject_state = $$props => {
    		if ("domElement" in $$props) $$invalidate(2, domElement = $$props.domElement);
    		if ("identityOptions" in $$props) $$invalidate(6, identityOptions = $$props.identityOptions);
    		if ("passThroughOptions" in $$props) $$invalidate(0, passThroughOptions = $$props.passThroughOptions);
    		if ("dialogicOptions" in $$props) $$invalidate(1, dialogicOptions = $$props.dialogicOptions);
    	};

    	return [
    		passThroughOptions,
    		dialogicOptions,
    		domElement,
    		className,
    		show,
    		hide,
    		identityOptions,
    		dispatch,
    		dispatchTransition,
    		div_binding
    	];
    }

    class Instance extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance, create_fragment, safe_not_equal, {
    			identityOptions: 6,
    			passThroughOptions: 0,
    			dialogicOptions: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Instance",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || ({});

    		if (/*identityOptions*/ ctx[6] === undefined && !("identityOptions" in props)) {
    			console.warn("<Instance> was created without expected prop 'identityOptions'");
    		}

    		if (/*passThroughOptions*/ ctx[0] === undefined && !("passThroughOptions" in props)) {
    			console.warn("<Instance> was created without expected prop 'passThroughOptions'");
    		}

    		if (/*dialogicOptions*/ ctx[1] === undefined && !("dialogicOptions" in props)) {
    			console.warn("<Instance> was created without expected prop 'dialogicOptions'");
    		}
    	}

    	get identityOptions() {
    		throw new Error("<Instance>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set identityOptions(value) {
    		throw new Error("<Instance>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get passThroughOptions() {
    		throw new Error("<Instance>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set passThroughOptions(value) {
    		throw new Error("<Instance>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dialogicOptions() {
    		throw new Error("<Instance>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dialogicOptions(value) {
    		throw new Error("<Instance>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* Users/arthur/code/Github Projects/dialogic/master/packages/dialogic-svelte/src/Wrapper.svelte generated by Svelte v3.16.5 */

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i].identityOptions;
    	child_ctx[6] = list[i].dialogicOptions;
    	child_ctx[7] = list[i].passThroughOptions;
    	child_ctx[8] = list[i].key;
    	child_ctx[10] = i;
    	return child_ctx;
    }

    // (17:0) {#each filterCandidates(ns, $appState.store, identityOptions) as { identityOptions, dialogicOptions, passThroughOptions, key }
    function create_each_block(key_1, ctx) {
    	let first;
    	let current;

    	const instance = new Instance({
    			props: {
    				identityOptions: /*identityOptions*/ ctx[1],
    				dialogicOptions: /*dialogicOptions*/ ctx[6],
    				passThroughOptions: /*passThroughOptions*/ ctx[7]
    			},
    			$$inline: true
    		});

    	instance.$on("mount", /*nsOnInstanceMounted*/ ctx[3]);
    	instance.$on("show", /*nsOnShowInstance*/ ctx[4]);
    	instance.$on("hide", /*nsOnHideInstance*/ ctx[5]);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			create_component(instance.$$.fragment);
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(instance, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const instance_changes = {};
    			if (dirty & /*ns, $appState, identityOptions*/ 7) instance_changes.identityOptions = /*identityOptions*/ ctx[1];
    			if (dirty & /*ns, $appState, identityOptions*/ 7) instance_changes.dialogicOptions = /*dialogicOptions*/ ctx[6];
    			if (dirty & /*ns, $appState, identityOptions*/ 7) instance_changes.passThroughOptions = /*passThroughOptions*/ ctx[7];
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
    			if (detaching) detach_dev(first);
    			destroy_component(instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(17:0) {#each filterCandidates(ns, $appState.store, identityOptions) as { identityOptions, dialogicOptions, passThroughOptions, key }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let current;
    	let each_value = filterCandidates(/*ns*/ ctx[0], /*$appState*/ ctx[2].store, /*identityOptions*/ ctx[1]);
    	const get_key = ctx => /*key*/ ctx[8];

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const each_value = filterCandidates(/*ns*/ ctx[0], /*$appState*/ ctx[2].store, /*identityOptions*/ ctx[1]);
    			group_outros();
    			each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block, each_1_anchor, get_each_context);
    			check_outros();
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance_1($$self, $$props, $$invalidate) {
    	let $appState;
    	validate_store(appState, "appState");
    	component_subscribe($$self, appState, $$value => $$invalidate(2, $appState = $$value));
    	let { identityOptions } = $$props;
    	let { ns } = $$props;
    	const nsOnInstanceMounted = onInstanceMounted(ns);
    	const nsOnShowInstance = onShowInstance(ns);
    	const nsOnHideInstance = onHideInstance(ns);
    	const writable_props = ["identityOptions", "ns"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Wrapper> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("identityOptions" in $$props) $$invalidate(1, identityOptions = $$props.identityOptions);
    		if ("ns" in $$props) $$invalidate(0, ns = $$props.ns);
    	};

    	$$self.$capture_state = () => {
    		return { identityOptions, ns, $appState };
    	};

    	$$self.$inject_state = $$props => {
    		if ("identityOptions" in $$props) $$invalidate(1, identityOptions = $$props.identityOptions);
    		if ("ns" in $$props) $$invalidate(0, ns = $$props.ns);
    		if ("$appState" in $$props) appState.set($appState = $$props.$appState);
    	};

    	return [
    		ns,
    		identityOptions,
    		$appState,
    		nsOnInstanceMounted,
    		nsOnShowInstance,
    		nsOnHideInstance
    	];
    }

    class Wrapper extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance_1, create_fragment$1, safe_not_equal, { identityOptions: 1, ns: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Wrapper",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || ({});

    		if (/*identityOptions*/ ctx[1] === undefined && !("identityOptions" in props)) {
    			console.warn("<Wrapper> was created without expected prop 'identityOptions'");
    		}

    		if (/*ns*/ ctx[0] === undefined && !("ns" in props)) {
    			console.warn("<Wrapper> was created without expected prop 'ns'");
    		}
    	}

    	get identityOptions() {
    		throw new Error("<Wrapper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set identityOptions(value) {
    		throw new Error("<Wrapper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ns() {
    		throw new Error("<Wrapper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ns(value) {
    		throw new Error("<Wrapper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* Users/arthur/code/Github Projects/dialogic/master/packages/dialogic-svelte/src/Dialogical.svelte generated by Svelte v3.16.5 */

    function create_fragment$2(ctx) {
    	let current;

    	const wrapper = new Wrapper({
    			props: {
    				identityOptions: /*identityOptions*/ ctx[1],
    				ns: /*ns*/ ctx[0]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(wrapper.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(wrapper, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const wrapper_changes = {};
    			if (dirty & /*ns*/ 1) wrapper_changes.ns = /*ns*/ ctx[0];
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

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { type } = $$props;
    	let { ns = type.ns } = $$props;
    	let { spawn = undefined } = $$props;
    	let { id = undefined } = $$props;
    	let { onMount: onMount$1 = undefined } = $$props;

    	const identityOptions = {
    		id: id || type.defaultId,
    		spawn: spawn || type.defaultSpawn
    	};

    	onMount(() => {
    		if (typeof onMount$1 === "function") {
    			onMount$1();
    		}
    	});

    	const writable_props = ["type", "ns", "spawn", "id", "onMount"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Dialogical> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("type" in $$props) $$invalidate(2, type = $$props.type);
    		if ("ns" in $$props) $$invalidate(0, ns = $$props.ns);
    		if ("spawn" in $$props) $$invalidate(3, spawn = $$props.spawn);
    		if ("id" in $$props) $$invalidate(4, id = $$props.id);
    		if ("onMount" in $$props) $$invalidate(5, onMount$1 = $$props.onMount);
    	};

    	$$self.$capture_state = () => {
    		return { type, ns, spawn, id, onMount: onMount$1 };
    	};

    	$$self.$inject_state = $$props => {
    		if ("type" in $$props) $$invalidate(2, type = $$props.type);
    		if ("ns" in $$props) $$invalidate(0, ns = $$props.ns);
    		if ("spawn" in $$props) $$invalidate(3, spawn = $$props.spawn);
    		if ("id" in $$props) $$invalidate(4, id = $$props.id);
    		if ("onMount" in $$props) $$invalidate(5, onMount$1 = $$props.onMount);
    	};

    	return [ns, identityOptions, type, spawn, id, onMount$1];
    }

    class Dialogical extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$1, create_fragment$2, safe_not_equal, {
    			type: 2,
    			ns: 0,
    			spawn: 3,
    			id: 4,
    			onMount: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Dialogical",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || ({});

    		if (/*type*/ ctx[2] === undefined && !("type" in props)) {
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

    /* Users/arthur/code/Github Projects/dialogic/master/packages/dialogic-svelte/src/Dialog.svelte generated by Svelte v3.16.5 */

    function create_fragment$3(ctx) {
    	let current;
    	const dialogical_spread_levels = [/*$$props*/ ctx[0], { type: dialog$1 }];
    	let dialogical_props = {};

    	for (let i = 0; i < dialogical_spread_levels.length; i += 1) {
    		dialogical_props = assign(dialogical_props, dialogical_spread_levels[i]);
    	}

    	const dialogical = new Dialogical({ props: dialogical_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(dialogical.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(dialogical, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const dialogical_changes = (dirty & /*$$props, dialog*/ 1)
    			? get_spread_update(dialogical_spread_levels, [
    					dirty & /*$$props*/ 1 && get_spread_object(/*$$props*/ ctx[0]),
    					dirty & /*dialog*/ 0 && ({ type: dialog$1 })
    				])
    			: {};

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

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	$$self.$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class Dialog extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Dialog",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* Users/arthur/code/Github Projects/dialogic/master/packages/dialogic-svelte/src/Notification.svelte generated by Svelte v3.16.5 */

    function create_fragment$4(ctx) {
    	let current;
    	const dialogical_spread_levels = [/*$$props*/ ctx[0], { type: notification$1 }];
    	let dialogical_props = {};

    	for (let i = 0; i < dialogical_spread_levels.length; i += 1) {
    		dialogical_props = assign(dialogical_props, dialogical_spread_levels[i]);
    	}

    	const dialogical = new Dialogical({ props: dialogical_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(dialogical.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(dialogical, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const dialogical_changes = (dirty & /*$$props, notification*/ 1)
    			? get_spread_update(dialogical_spread_levels, [
    					dirty & /*$$props*/ 1 && get_spread_object(/*$$props*/ ctx[0]),
    					dirty & /*notification*/ 0 && ({ type: notification$1 })
    				])
    			: {};

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

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	$$self.$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class Notification extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Notification",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/DialogContent.svelte generated by Svelte v3.16.5 */
    const file$1 = "src/DialogContent.svelte";

    function create_fragment$5(ctx) {
    	let div4;
    	let div3;
    	let div2;
    	let h2;
    	let t0_value = /*$$props*/ ctx[0].title + "";
    	let t0;
    	let t1;
    	let div0;
    	let t2_value = /*$$props*/ ctx[0].body + "";
    	let t2;
    	let t3;
    	let footer;
    	let div1;
    	let button0;
    	let span0;
    	let t5;
    	let button1;
    	let span1;
    	let dispose;

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div3 = element("div");
    			div2 = element("div");
    			h2 = element("h2");
    			t0 = text(t0_value);
    			t1 = space();
    			div0 = element("div");
    			t2 = text(t2_value);
    			t3 = space();
    			footer = element("footer");
    			div1 = element("div");
    			button0 = element("button");
    			span0 = element("span");
    			span0.textContent = "Never mind";
    			t5 = space();
    			button1 = element("button");
    			span1 = element("span");
    			span1.textContent = "Yes, retry";
    			attr_dev(h2, "class", "h2 mdc-dialog__title");
    			add_location(h2, file$1, 7, 6, 166);
    			attr_dev(div0, "class", "mdc-dialog__content");
    			add_location(div0, file$1, 10, 6, 242);
    			attr_dev(span0, "class", "mdc-button__label");
    			add_location(span0, file$1, 22, 12, 569);
    			attr_dev(button0, "class", "mdc-button mdc-dialog__button");
    			add_location(button0, file$1, 15, 10, 379);
    			attr_dev(span1, "class", "mdc-button__label");
    			add_location(span1, file$1, 31, 12, 839);
    			attr_dev(button1, "class", "mdc-button mdc-dialog__button");
    			add_location(button1, file$1, 24, 10, 649);
    			add_location(div1, file$1, 14, 8, 363);
    			attr_dev(footer, "class", "mdc-dialog__actions");
    			add_location(footer, file$1, 13, 6, 318);
    			add_location(div2, file$1, 6, 4, 154);
    			attr_dev(div3, "class", "mdc-dialog__surface");
    			add_location(div3, file$1, 5, 2, 116);
    			attr_dev(div4, "class", "mdc-dialog__container");
    			add_location(div4, file$1, 4, 0, 78);

    			dispose = [
    				listen_dev(button0, "click", /*click_handler*/ ctx[1], false, false, false),
    				listen_dev(button1, "click", /*click_handler_1*/ ctx[2], false, false, false)
    			];
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div2, h2);
    			append_dev(h2, t0);
    			append_dev(div2, t1);
    			append_dev(div2, div0);
    			append_dev(div0, t2);
    			append_dev(div2, t3);
    			append_dev(div2, footer);
    			append_dev(footer, div1);
    			append_dev(div1, button0);
    			append_dev(button0, span0);
    			append_dev(div1, t5);
    			append_dev(div1, button1);
    			append_dev(button1, span1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$$props*/ 1 && t0_value !== (t0_value = /*$$props*/ ctx[0].title + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*$$props*/ 1 && t2_value !== (t2_value = /*$$props*/ ctx[0].body + "")) set_data_dev(t2, t2_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	const click_handler = () => {
    		dialog$1.hide();
    		$$props.onReject();
    	};

    	const click_handler_1 = () => {
    		dialog$1.hide();
    		$$props.onAccept();
    	};

    	$$self.$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	$$props = exclude_internal_props($$props);
    	return [$$props, click_handler, click_handler_1];
    }

    class DialogContent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DialogContent",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/DialogComponent.svelte generated by Svelte v3.16.5 */
    const file$2 = "src/DialogComponent.svelte";

    function create_fragment$6(ctx) {
    	let div1;
    	let t;
    	let div0;
    	let current;
    	const dialogcontent_spread_levels = [/*$$props*/ ctx[0]];
    	let dialogcontent_props = {};

    	for (let i = 0; i < dialogcontent_spread_levels.length; i += 1) {
    		dialogcontent_props = assign(dialogcontent_props, dialogcontent_spread_levels[i]);
    	}

    	const dialogcontent = new DialogContent({
    			props: dialogcontent_props,
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			create_component(dialogcontent.$$.fragment);
    			t = space();
    			div0 = element("div");
    			attr_dev(div0, "class", "mdc-dialog__scrim");
    			add_location(div0, file$2, 12, 4, 276);
    			attr_dev(div1, "class", "mdc-dialog mdc-dialog--open");
    			attr_dev(div1, "role", "alertdialog");
    			attr_dev(div1, "aria-modal", "true");
    			attr_dev(div1, "aria-labelledby", "my-dialog-title");
    			attr_dev(div1, "aria-describedby", "my-dialog-content");
    			add_location(div1, file$2, 4, 0, 74);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			mount_component(dialogcontent, div1, null);
    			append_dev(div1, t);
    			append_dev(div1, div0);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const dialogcontent_changes = (dirty & /*$$props*/ 1)
    			? get_spread_update(dialogcontent_spread_levels, [get_spread_object(/*$$props*/ ctx[0])])
    			: {};

    			dialogcontent.$set(dialogcontent_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dialogcontent.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dialogcontent.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(dialogcontent);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	$$self.$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class DialogComponent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DialogComponent",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src/NotificationContent.svelte generated by Svelte v3.16.5 */
    const file$3 = "src/NotificationContent.svelte";

    function create_fragment$7(ctx) {
    	let div0;
    	let t1;
    	let div1;
    	let button;
    	let dispose;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			div0.textContent = "Can't send photo. Retry in 5 seconds.";
    			t1 = space();
    			div1 = element("div");
    			button = element("button");
    			button.textContent = "Retry";
    			attr_dev(div0, "class", "mdc-snackbar__label");
    			add_location(div0, file$3, 5, 0, 136);
    			attr_dev(button, "class", "button mdc-button mdc-snackbar__action");
    			add_location(button, file$3, 9, 2, 255);
    			attr_dev(div1, "class", "mdc-snackbar__actions");
    			add_location(div1, file$3, 8, 0, 217);
    			dispose = listen_dev(button, "click", /*click_handler*/ ctx[0], false, false, false);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, button);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self) {
    	const click_handler = () => {
    		notification$1.pause();

    		dialog$1.show({
    			dialogic: {
    				component: DialogComponent,
    				className: "dialog"
    			},
    			title: "Retry sending?",
    			body: "We have noticed a slow internet connection. Sending may take a bit longer than usual.",
    			onAccept: () => {
    				notification$1.hide();
    				notification$1.resume();
    			},
    			onReject: () => {
    				notification$1.resume({ minimumDuration: 2000 });
    			}
    		});
    	};

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		
    	};

    	return [click_handler];
    }

    class NotificationContent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NotificationContent",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src/NotificationComponent.svelte generated by Svelte v3.16.5 */
    const file$4 = "src/NotificationComponent.svelte";

    function create_fragment$8(ctx) {
    	let div1;
    	let div0;
    	let current;
    	const notificationcontent = new NotificationContent({ $$inline: true });

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(notificationcontent.$$.fragment);
    			attr_dev(div0, "class", "mdc-snackbar__surface");
    			add_location(div0, file$4, 9, 2, 184);
    			attr_dev(div1, "class", "mdc-snackbar mdc-snackbar--open");
    			add_location(div1, file$4, 8, 0, 136);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(notificationcontent, div0, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(notificationcontent.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(notificationcontent.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(notificationcontent);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    class NotificationComponent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NotificationComponent",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src/Remaining.svelte generated by Svelte v3.16.5 */
    const file$5 = "src/Remaining.svelte";

    function create_fragment$9(ctx) {
    	let div;
    	let span;

    	let t_value = (/*displayValue*/ ctx[0] === undefined
    	? "undefined"
    	: /*displayValue*/ ctx[0].toString()) + "";

    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			t = text(t_value);
    			attr_dev(span, "data-test-id", "remaining-value");
    			add_location(span, file$5, 24, 2, 470);
    			attr_dev(div, "data-test-id", "remaining");
    			add_location(div, file$5, 23, 0, 437);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);
    			append_dev(span, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*displayValue*/ 1 && t_value !== (t_value = (/*displayValue*/ ctx[0] === undefined
    			? "undefined"
    			: /*displayValue*/ ctx[0].toString()) + "")) set_data_dev(t, t_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { getRemaining } = $$props;
    	let displayValue = 0;
    	let reqId;

    	const update = () => {
    		const value = getRemaining();
    		$$invalidate(0, displayValue = value === undefined ? undefined : Math.max(value, 0));
    		reqId = window.requestAnimationFrame(update);
    	};

    	reqId = window.requestAnimationFrame(update);

    	onDestroy(() => {
    		window.cancelAnimationFrame(reqId);
    	});

    	const writable_props = ["getRemaining"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Remaining> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("getRemaining" in $$props) $$invalidate(1, getRemaining = $$props.getRemaining);
    	};

    	$$self.$capture_state = () => {
    		return { getRemaining, displayValue, reqId };
    	};

    	$$self.$inject_state = $$props => {
    		if ("getRemaining" in $$props) $$invalidate(1, getRemaining = $$props.getRemaining);
    		if ("displayValue" in $$props) $$invalidate(0, displayValue = $$props.displayValue);
    		if ("reqId" in $$props) reqId = $$props.reqId;
    	};

    	return [displayValue, getRemaining];
    }

    class Remaining extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$9, safe_not_equal, { getRemaining: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Remaining",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || ({});

    		if (/*getRemaining*/ ctx[1] === undefined && !("getRemaining" in props)) {
    			console.warn("<Remaining> was created without expected prop 'getRemaining'");
    		}
    	}

    	get getRemaining() {
    		throw new Error("<Remaining>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getRemaining(value) {
    		throw new Error("<Remaining>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.16.5 */
    const file$6 = "src/App.svelte";

    function create_fragment$a(ctx) {
    	let div9;
    	let main;
    	let h1;
    	let t1;
    	let div0;
    	let t3;
    	let div1;
    	let button0;
    	let t5;
    	let button1;
    	let t7;
    	let button2;
    	let t9;
    	let button3;
    	let t11;
    	let button4;
    	let t13;
    	let div8;
    	let div3;
    	let t14;
    	let div2;
    	let t15;
    	let t16;
    	let div5;
    	let t17;
    	let div4;
    	let t18;
    	let t19;
    	let div7;
    	let t20;
    	let div6;
    	let t21;
    	let footer;
    	let t22;
    	let a;
    	let t24;
    	let t25;
    	let current;
    	let dispose;

    	const remaining = new Remaining({
    			props: { getRemaining: notification$1.getRemaining },
    			$$inline: true
    		});

    	const dialog = new Dialog({ $$inline: true });
    	const notification_1 = new Notification({ $$inline: true });

    	const block = {
    		c: function create() {
    			div9 = element("div");
    			main = element("main");
    			h1 = element("h1");
    			h1.textContent = "Dialogic for Svelte demo";
    			t1 = space();
    			div0 = element("div");
    			div0.textContent = "Add one or more notifications, then click on the Retry button in the message.";
    			t3 = space();
    			div1 = element("div");
    			button0 = element("button");
    			button0.textContent = "Add notification";
    			t5 = space();
    			button1 = element("button");
    			button1.textContent = "Pause";
    			t7 = space();
    			button2 = element("button");
    			button2.textContent = "Resume";
    			t9 = space();
    			button3 = element("button");
    			button3.textContent = "Hide all";
    			t11 = space();
    			button4 = element("button");
    			button4.textContent = "Reset all";
    			t13 = space();
    			div8 = element("div");
    			div3 = element("div");
    			t14 = text("Notifications\n\t\t\t\t");
    			div2 = element("div");
    			t15 = text(/*$notificationCount*/ ctx[0]);
    			t16 = space();
    			div5 = element("div");
    			t17 = text("Is paused\n\t\t\t\t");
    			div4 = element("div");
    			t18 = text(/*$notificationIsPaused*/ ctx[1]);
    			t19 = space();
    			div7 = element("div");
    			t20 = text("Remaining\n\t\t\t\t");
    			div6 = element("div");
    			create_component(remaining.$$.fragment);
    			t21 = space();
    			footer = element("footer");
    			t22 = text("Dialogic: manage dialogs and notifications. ");
    			a = element("a");
    			a.textContent = "Main documentation on GitHub";
    			t24 = space();
    			create_component(dialog.$$.fragment);
    			t25 = space();
    			create_component(notification_1.$$.fragment);
    			add_location(h1, file$6, 11, 2, 342);
    			attr_dev(div0, "class", "message");
    			add_location(div0, file$6, 12, 2, 378);
    			attr_dev(button0, "class", "ui button primary");
    			add_location(button0, file$6, 14, 3, 513);
    			attr_dev(button1, "class", "ui button");
    			add_location(button1, file$6, 26, 3, 752);
    			attr_dev(button2, "class", "ui button");
    			add_location(button2, file$6, 33, 3, 864);
    			attr_dev(button3, "class", "ui button");
    			add_location(button3, file$6, 40, 3, 978);
    			attr_dev(button4, "class", "ui button");
    			add_location(button4, file$6, 47, 3, 1095);
    			attr_dev(div1, "class", "ui message");
    			add_location(div1, file$6, 13, 2, 485);
    			attr_dev(div2, "class", "detail");
    			add_location(div2, file$6, 58, 4, 1295);
    			attr_dev(div3, "class", "ui label");
    			add_location(div3, file$6, 56, 3, 1250);
    			attr_dev(div4, "class", "detail");
    			add_location(div4, file$6, 64, 4, 1407);
    			attr_dev(div5, "class", "ui label");
    			add_location(div5, file$6, 62, 3, 1366);
    			attr_dev(div6, "class", "detail");
    			add_location(div6, file$6, 70, 4, 1522);
    			attr_dev(div7, "class", "ui label");
    			add_location(div7, file$6, 68, 3, 1481);
    			attr_dev(div8, "class", "ui message");
    			add_location(div8, file$6, 55, 2, 1222);
    			add_location(main, file$6, 10, 1, 333);
    			attr_dev(a, "href", "https://github.com/ArthurClemens/dialogic");
    			add_location(a, file$6, 77, 46, 1698);
    			add_location(footer, file$6, 76, 1, 1643);
    			attr_dev(div9, "class", "page");
    			add_location(div9, file$6, 9, 0, 313);

    			dispose = [
    				listen_dev(button0, "click", /*click_handler*/ ctx[4], false, false, false),
    				listen_dev(button1, "click", /*click_handler_1*/ ctx[5], false, false, false),
    				listen_dev(button2, "click", /*click_handler_2*/ ctx[6], false, false, false),
    				listen_dev(button3, "click", /*click_handler_3*/ ctx[7], false, false, false),
    				listen_dev(button4, "click", /*click_handler_4*/ ctx[8], false, false, false)
    			];
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div9, anchor);
    			append_dev(div9, main);
    			append_dev(main, h1);
    			append_dev(main, t1);
    			append_dev(main, div0);
    			append_dev(main, t3);
    			append_dev(main, div1);
    			append_dev(div1, button0);
    			append_dev(div1, t5);
    			append_dev(div1, button1);
    			append_dev(div1, t7);
    			append_dev(div1, button2);
    			append_dev(div1, t9);
    			append_dev(div1, button3);
    			append_dev(div1, t11);
    			append_dev(div1, button4);
    			append_dev(main, t13);
    			append_dev(main, div8);
    			append_dev(div8, div3);
    			append_dev(div3, t14);
    			append_dev(div3, div2);
    			append_dev(div2, t15);
    			append_dev(div8, t16);
    			append_dev(div8, div5);
    			append_dev(div5, t17);
    			append_dev(div5, div4);
    			append_dev(div4, t18);
    			append_dev(div8, t19);
    			append_dev(div8, div7);
    			append_dev(div7, t20);
    			append_dev(div7, div6);
    			mount_component(remaining, div6, null);
    			append_dev(div9, t21);
    			append_dev(div9, footer);
    			append_dev(footer, t22);
    			append_dev(footer, a);
    			insert_dev(target, t24, anchor);
    			mount_component(dialog, target, anchor);
    			insert_dev(target, t25, anchor);
    			mount_component(notification_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*$notificationCount*/ 1) set_data_dev(t15, /*$notificationCount*/ ctx[0]);
    			if (!current || dirty & /*$notificationIsPaused*/ 2) set_data_dev(t18, /*$notificationIsPaused*/ ctx[1]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(remaining.$$.fragment, local);
    			transition_in(dialog.$$.fragment, local);
    			transition_in(notification_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(remaining.$$.fragment, local);
    			transition_out(dialog.$$.fragment, local);
    			transition_out(notification_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div9);
    			destroy_component(remaining);
    			if (detaching) detach_dev(t24);
    			destroy_component(dialog, detaching);
    			if (detaching) detach_dev(t25);
    			destroy_component(notification_1, detaching);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let $notificationCount;
    	let $notificationIsPaused;
    	const notificationIsPaused = notification$1.isPaused();
    	validate_store(notificationIsPaused, "notificationIsPaused");
    	component_subscribe($$self, notificationIsPaused, value => $$invalidate(1, $notificationIsPaused = value));
    	const notificationCount = notification$1.getCount();
    	validate_store(notificationCount, "notificationCount");
    	component_subscribe($$self, notificationCount, value => $$invalidate(0, $notificationCount = value));

    	const click_handler = () => {
    		notification$1.show({
    			dialogic: {
    				component: NotificationComponent,
    				className: "notification"
    			}
    		});
    	};

    	const click_handler_1 = () => {
    		notification$1.pause();
    	};

    	const click_handler_2 = () => {
    		notification$1.resume();
    	};

    	const click_handler_3 = () => {
    		notification$1.hideAll();
    	};

    	const click_handler_4 = () => {
    		notification$1.resetAll();
    	};

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ("$notificationCount" in $$props) notificationCount.set($notificationCount = $$props.$notificationCount);
    		if ("$notificationIsPaused" in $$props) notificationIsPaused.set($notificationIsPaused = $$props.$notificationIsPaused);
    	};

    	return [
    		$notificationCount,
    		$notificationIsPaused,
    		notificationIsPaused,
    		notificationCount,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    var app = new App({
        target: document.body
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
