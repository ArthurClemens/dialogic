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
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
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
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
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
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
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
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            callbacks.slice().forEach(fn => fn(event));
        }
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
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
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

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
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
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error(`Cannot have duplicate keys in a keyed each`);
            }
            keys.add(key);
        }
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
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
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
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
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
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.25.0' }, detail)));
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
        if (text.wholeText === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
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
        $capture_state() { }
        $inject_state() { }
    }

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

    var stream$1 = stream;

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
        const transitionStyle = styles[step] || {};
        Object.keys(transitionStyle).forEach((key) => {
            const value = transitionStyle[key].toString();
            domElement.style[key] = value;
            // if (domElement.style[key] !== value) {
            // 	console.warn(`Invalid style: ${key}: ${value} (${domElement.style[key]})`);
            // }
        });
    };
    const applyNoDurationTransitionStyle = (domElement) => (domElement.style.transitionDuration = '0ms');
    const getTransitionStyles = (domElement, styles) => (typeof styles === 'function' ? styles(domElement) : styles) || {};
    const createClassList = (className, step) => className.split(/ /).map((n) => `${n}-${step}`);
    const applyStylesForState = (domElement, props, step, isEnterStep) => {
        if (props.styles) {
            const styles = getTransitionStyles(domElement, props.styles);
            applyTransitionStyles(domElement, 'default', styles);
            isEnterStep && applyNoDurationTransitionStyle(domElement);
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
            transitionClassNames &&
                domElement.classList.add(...transitionClassNames[step]);
        }
        // reflow
        domElement.scrollTop;
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
        const domElement = props.domElement;
        if (!domElement) {
            return Promise.resolve('no domElement');
        }
        clearTimeout(props.__transitionTimeoutId__);
        let currentStep = mode === MODE.SHOW ? 'showStart' : 'hideStart';
        return new Promise(resolve => {
            applyStylesForState(domElement, props, currentStep, currentStep === 'showStart');
            setTimeout(() => {
                const nextStep = steps[currentStep].nextStep;
                if (nextStep) {
                    currentStep = nextStep;
                    applyStylesForState(domElement, props, currentStep);
                    // addEventListener sometimes hangs this function because it never finishes
                    // Using setTimeout instead of addEventListener gives more consistent results
                    const duration = getDuration(domElement);
                    props.__transitionTimeoutId__ = setTimeout(resolve, duration);
                }
            }, 0);
        });
    };
    const styleDurationToMs = (durationStr) => {
        const parsed = parseFloat(durationStr) * (durationStr.indexOf('ms') === -1 ? 1000 : 1);
        return isNaN(parsed) ? 0 : parsed;
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
    const createId = (identityOptions, ns) => [ns, identityOptions.id, identityOptions.spawn].filter(Boolean).join('-');
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
                    return item ? { just: item } : { nothing: undefined };
                },
                getAll: (ns, identityOptions) => {
                    const state = states();
                    const items = state.store[ns] || [];
                    const spawn = identityOptions !== undefined ? identityOptions.spawn : undefined;
                    const id = identityOptions !== undefined ? identityOptions.id : undefined;
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
    const update$1 = stream$1();
    const states = stream$1.scan((state, patch) => patch(state), {
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
                }),
        };
    };
    const appendStopTimeout = (state) => {
        window.clearTimeout(state.timerId);
        return {
            timerId: initialState.timerId,
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
            remaining: getRemaining(state),
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
    const getRemaining = (state) => state.remaining === 0 || state.remaining === undefined
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
                                ...initialState,
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
                                ...(state.isPaused && appendResumeTimer(state, minimumDuration)),
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
                        return state.isPaused ? state.remaining : getRemaining(state);
                    },
                    getResultPromise: () => {
                        const state = states();
                        return state.promise;
                    },
                };
            },
        };
        const update = stream$1();
        const states = stream$1.scan((state, patch) => patch(state), {
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
    const getUid = () => (uid === Number.MAX_VALUE ? 0 : uid++);
    const transitionStates = {
        default: 0,
        displaying: 1,
        hiding: 2,
    };
    const getMaybeItem = (ns) => (defaultDialogicOptions) => (identityOptions) => selectors.find(ns, getMergedIdentityOptions(defaultDialogicOptions, identityOptions));
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
            spawn: options.dialogic ? options.dialogic.spawn : undefined,
        };
        const mergedIdentityOptions = getMergedIdentityOptions(defaultDialogicOptions || {}, identityOptions);
        const dialogicOptions = {
            ...defaultDialogicOptions,
            ...options.dialogic,
            __transitionTimeoutId__: 0,
        };
        const passThroughOptions = getPassThroughOptions(options);
        return {
            identityOptions: mergedIdentityOptions,
            dialogicOptions,
            passThroughOptions,
        };
    };
    const createInstance = (ns) => (defaultDialogicOptions) => (options = {}) => {
        const { identityOptions, dialogicOptions, passThroughOptions, } = handleOptions(defaultDialogicOptions, options);
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
                timer: dialogicOptions.timeout ? Timer() : undefined,
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
                    key: existingItem.key,
                    transitionState: existingItem.transitionState,
                    dialogicOptions,
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
        const { identityOptions, dialogicOptions, passThroughOptions, } = handleOptions(defaultDialogicOptions, options);
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
                    passThroughOptions,
                },
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
        const items = getValidItems(ns, identityOptions).filter(item => !!item.timer);
        items.forEach((item) => item.timer && item.timer.actions.pause());
        return Promise.all(items);
    };
    const resume = (ns) => (defaultDialogicOptions) => (commandOptions) => {
        const options = commandOptions || {};
        const identityOptions = {
            id: options.id,
            spawn: options.spawn,
        };
        const items = getValidItems(ns, identityOptions).filter(item => !!item.timer);
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
    const isPaused = getTimerProperty('isPaused', false);
    const getRemaining$1 = getTimerProperty('getRemaining', undefined);
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
                ...dialogicOptions,
            },
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
            spawn: options.spawn,
        };
        const validItems = getValidItems(ns, identityOptions);
        const regularItems = validItems.filter((item) => !options.queued && !item.dialogicOptions.queued);
        const queuedItems = validItems.filter((item) => options.queued || item.dialogicOptions.queued);
        const items = [];
        regularItems.forEach((item) => items.push(hideItem(getOverridingTransitionOptions(item, options))));
        if (queuedItems.length > 0) {
            const [current] = queuedItems;
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
        timer.actions.start(() => hideItem(item), timeout);
        return getTimerProperty('getResultPromise', undefined);
    };
    const showItem = async function (item) {
        if (item.callbacks.willShow) {
            item.callbacks.willShow(item);
        }
        if (item.transitionState !== transitionStates.displaying) {
            item.transitionState = transitionStates.displaying;
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
    const hideItem = async function (item) {
        item.transitionState = transitionStates.hiding;
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
        const copy = {
            ...item,
        };
        actions.remove(item.ns, item.id);
        return Promise.resolve(copy);
    };
    const setDomElement = (domElement, item) => {
        item.dialogicOptions.domElement = domElement;
    };

    const dialogical = ({ ns, queued, timeout, }) => {
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

    const dialog = dialogical({ ns: 'dialog' });

    const notification = dialogical({
        ns: 'notification',
        queued: true,
        timeout: 3000,
    });

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
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
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
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
      ...selectors,
    };

    states.map(state =>
      appState.set({
        ...state,
        ...selectors,
      }),
    );

    const getCount$1 = ns => identityOptions =>
      derived(appState, () => selectors.getCount(ns, identityOptions));

    const isPaused$1 = ns => defaultDialogicOptions => identityOptions =>
      derived(appState, () =>
        isPaused(ns)(defaultDialogicOptions)(identityOptions),
      );

    const exists$1 = ns => defaultDialogicOptions => identityOptions =>
      derived(appState, () =>
        exists(ns)(defaultDialogicOptions)(identityOptions),
      );

    const dialog$1 = {
      ...dialog,
      getCount: identityOptions => getCount$1(dialog.ns)(identityOptions),
      isPaused: identityOptions =>
        isPaused$1(dialog.ns)(dialog.defaultDialogicOptions)(identityOptions),
      exists: identityOptions =>
        exists$1(dialog.ns)(dialog.defaultDialogicOptions)(identityOptions),
    };

    const notification$1 = {
      ...notification,
      getCount: identityOptions => getCount$1(notification.ns)(identityOptions),
      isPaused: identityOptions =>
        isPaused$1(notification.ns)(notification.defaultDialogicOptions)(
          identityOptions,
        ),
      exists: identityOptions =>
        exists$1(notification.ns)(notification.defaultDialogicOptions)(
          identityOptions,
        ),
    };

    const handleDispatch = ns => (event, fn) => {
      // Update dispatching item:
      const maybeItem = selectors.find(ns, event.detail.identityOptions);
      if (maybeItem.just) {
        setDomElement(event.detail.domElement, maybeItem.just);
      }
      // Find item to transition:
      const maybeTransitioningItem = selectors.find(
        ns,
        event.detail.identityOptions,
      );
      if (maybeTransitioningItem.just) {
        fn(maybeTransitioningItem.just);
      }
    };

    const onInstanceMounted = ns => event =>
      handleDispatch(ns)(event, showItem);

    const onShowInstance = ns => event =>
      handleDispatch(ns)(event, showItem);

    const onHideInstance = ns => event =>
      handleDispatch(ns)(event, hideItem);

    /* Users/arthur/code/Github Projects/dialogic/master/packages/dialogic-svelte/src/Instance.svelte generated by Svelte v3.25.0 */
    const file = "Users/arthur/code/Github Projects/dialogic/master/packages/dialogic-svelte/src/Instance.svelte";

    function create_fragment(ctx) {
    	let div;
    	let switch_instance;
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
    		switch_instance = new switch_value(switch_props());
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

    			/*div_binding*/ ctx[7](div);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const switch_instance_changes = (dirty & /*show, hide, passThroughOptions*/ 49)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*show*/ 16 && { show: /*show*/ ctx[4] },
    					dirty & /*hide*/ 32 && { hide: /*hide*/ ctx[5] },
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
    			/*div_binding*/ ctx[7](null);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Instance", slots, []);
    	const dispatch = createEventDispatcher();

    	// DOM bindings
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
    			domElement = $$value;
    			$$invalidate(2, domElement);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ("identityOptions" in $$props) $$invalidate(6, identityOptions = $$props.identityOptions);
    		if ("passThroughOptions" in $$props) $$invalidate(0, passThroughOptions = $$props.passThroughOptions);
    		if ("dialogicOptions" in $$props) $$invalidate(1, dialogicOptions = $$props.dialogicOptions);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		createEventDispatcher,
    		dispatch,
    		domElement,
    		identityOptions,
    		passThroughOptions,
    		dialogicOptions,
    		className,
    		dispatchTransition,
    		show,
    		hide
    	});

    	$$self.$inject_state = $$props => {
    		if ("domElement" in $$props) $$invalidate(2, domElement = $$props.domElement);
    		if ("identityOptions" in $$props) $$invalidate(6, identityOptions = $$props.identityOptions);
    		if ("passThroughOptions" in $$props) $$invalidate(0, passThroughOptions = $$props.passThroughOptions);
    		if ("dialogicOptions" in $$props) $$invalidate(1, dialogicOptions = $$props.dialogicOptions);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		passThroughOptions,
    		dialogicOptions,
    		domElement,
    		className,
    		show,
    		hide,
    		identityOptions,
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
    		const props = options.props || {};

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

    /* Users/arthur/code/Github Projects/dialogic/master/packages/dialogic-svelte/src/Wrapper.svelte generated by Svelte v3.25.0 */

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
    	let instance;
    	let current;

    	instance = new Instance({
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
    	validate_each_argument(each_value);
    	const get_key = ctx => /*key*/ ctx[8];
    	validate_each_keys(ctx, each_value, get_each_context, get_key);

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
    			if (dirty & /*filterCandidates, ns, $appState, identityOptions, nsOnInstanceMounted, nsOnShowInstance, nsOnHideInstance*/ 63) {
    				const each_value = filterCandidates(/*ns*/ ctx[0], /*$appState*/ ctx[2].store, /*identityOptions*/ ctx[1]);
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block, each_1_anchor, get_each_context);
    				check_outros();
    			}
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Wrapper", slots, []);
    	let { identityOptions } = $$props;
    	let { ns } = $$props;
    	const nsOnInstanceMounted = onInstanceMounted(ns);
    	const nsOnShowInstance = onShowInstance(ns);
    	const nsOnHideInstance = onHideInstance(ns);
    	const writable_props = ["identityOptions", "ns"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Wrapper> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("identityOptions" in $$props) $$invalidate(1, identityOptions = $$props.identityOptions);
    		if ("ns" in $$props) $$invalidate(0, ns = $$props.ns);
    	};

    	$$self.$capture_state = () => ({
    		appState,
    		filterCandidates,
    		onInstanceMounted,
    		onShowInstance,
    		onHideInstance,
    		Instance,
    		identityOptions,
    		ns,
    		nsOnInstanceMounted,
    		nsOnShowInstance,
    		nsOnHideInstance,
    		$appState
    	});

    	$$self.$inject_state = $$props => {
    		if ("identityOptions" in $$props) $$invalidate(1, identityOptions = $$props.identityOptions);
    		if ("ns" in $$props) $$invalidate(0, ns = $$props.ns);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

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
    		const props = options.props || {};

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

    /* Users/arthur/code/Github Projects/dialogic/master/packages/dialogic-svelte/src/Dialogical.svelte generated by Svelte v3.25.0 */

    function create_fragment$2(ctx) {
    	let wrapper;
    	let current;

    	wrapper = new Wrapper({
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Dialogical", slots, []);
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

    	$$self.$$set = $$props => {
    		if ("type" in $$props) $$invalidate(2, type = $$props.type);
    		if ("ns" in $$props) $$invalidate(0, ns = $$props.ns);
    		if ("spawn" in $$props) $$invalidate(3, spawn = $$props.spawn);
    		if ("id" in $$props) $$invalidate(4, id = $$props.id);
    		if ("onMount" in $$props) $$invalidate(5, onMount$1 = $$props.onMount);
    	};

    	$$self.$capture_state = () => ({
    		svelteOnMount: onMount,
    		Wrapper,
    		type,
    		ns,
    		spawn,
    		id,
    		onMount: onMount$1,
    		identityOptions
    	});

    	$$self.$inject_state = $$props => {
    		if ("type" in $$props) $$invalidate(2, type = $$props.type);
    		if ("ns" in $$props) $$invalidate(0, ns = $$props.ns);
    		if ("spawn" in $$props) $$invalidate(3, spawn = $$props.spawn);
    		if ("id" in $$props) $$invalidate(4, id = $$props.id);
    		if ("onMount" in $$props) $$invalidate(5, onMount$1 = $$props.onMount);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

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
    		const props = options.props || {};

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

    /* Users/arthur/code/Github Projects/dialogic/master/packages/dialogic-svelte/src/Dialog.svelte generated by Svelte v3.25.0 */

    function create_fragment$3(ctx) {
    	let dialogical;
    	let current;
    	const dialogical_spread_levels = [/*$$props*/ ctx[0], { type: dialog$1 }];
    	let dialogical_props = {};

    	for (let i = 0; i < dialogical_spread_levels.length; i += 1) {
    		dialogical_props = assign(dialogical_props, dialogical_spread_levels[i]);
    	}

    	dialogical = new Dialogical({ props: dialogical_props, $$inline: true });

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
    					dirty & /*dialog*/ 0 && { type: dialog$1 }
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Dialog", slots, []);

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$capture_state = () => ({ dialog: dialog$1, Dialogical });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

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

    /* Users/arthur/code/Github Projects/dialogic/master/packages/dialogic-svelte/src/Notification.svelte generated by Svelte v3.25.0 */

    function create_fragment$4(ctx) {
    	let dialogical;
    	let current;
    	const dialogical_spread_levels = [/*$$props*/ ctx[0], { type: notification$1 }];
    	let dialogical_props = {};

    	for (let i = 0; i < dialogical_spread_levels.length; i += 1) {
    		dialogical_props = assign(dialogical_props, dialogical_spread_levels[i]);
    	}

    	dialogical = new Dialogical({ props: dialogical_props, $$inline: true });

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
    					dirty & /*notification*/ 0 && { type: notification$1 }
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Notification", slots, []);

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$capture_state = () => ({ notification: notification$1, Dialogical });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

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

    /* Users/arthur/code/Github Projects/dialogic/master/packages/dialogic-svelte/src/UseDialogic.svelte generated by Svelte v3.25.0 */

    function create_fragment$5(ctx) {
    	const block = {
    		c: noop,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
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

    let useDialogicCounter = 0;
    const useEffect = subscribe => ({ subscribe });

    function instance_1$1($$self, $$props, $$invalidate) {
    	let $effect,
    		$$unsubscribe_effect = noop,
    		$$subscribe_effect = () => ($$unsubscribe_effect(), $$unsubscribe_effect = subscribe(effect, $$value => $$invalidate(8, $effect = $$value)), effect);

    	$$self.$$.on_destroy.push(() => $$unsubscribe_effect());
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("UseDialogic", slots, []);
    	const id = useDialogicCounter++;
    	let { props } = $$props;
    	let { isShow } = $$props;
    	let { isHide } = $$props;
    	let { deps } = $$props;
    	let { isIgnore } = $$props;
    	let { instance } = $$props;

    	const showInstance = () => {
    		instance.show(augProps);
    	};

    	const hideInstance = () => {
    		instance.hide(augProps);
    	};

    	let effect;
    	validate_store(effect, "effect");
    	$$subscribe_effect();

    	onMount(() => {
    		return () => {
    			hideInstance();
    		};
    	});

    	const writable_props = ["props", "isShow", "isHide", "deps", "isIgnore", "instance"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<UseDialogic> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("props" in $$props) $$invalidate(1, props = $$props.props);
    		if ("isShow" in $$props) $$invalidate(2, isShow = $$props.isShow);
    		if ("isHide" in $$props) $$invalidate(3, isHide = $$props.isHide);
    		if ("deps" in $$props) $$invalidate(4, deps = $$props.deps);
    		if ("isIgnore" in $$props) $$invalidate(5, isIgnore = $$props.isIgnore);
    		if ("instance" in $$props) $$invalidate(6, instance = $$props.instance);
    	};

    	$$self.$capture_state = () => ({
    		useDialogicCounter,
    		useEffect,
    		onMount,
    		id,
    		props,
    		isShow,
    		isHide,
    		deps,
    		isIgnore,
    		instance,
    		showInstance,
    		hideInstance,
    		effect,
    		augProps,
    		$effect
    	});

    	$$self.$inject_state = $$props => {
    		if ("props" in $$props) $$invalidate(1, props = $$props.props);
    		if ("isShow" in $$props) $$invalidate(2, isShow = $$props.isShow);
    		if ("isHide" in $$props) $$invalidate(3, isHide = $$props.isHide);
    		if ("deps" in $$props) $$invalidate(4, deps = $$props.deps);
    		if ("isIgnore" in $$props) $$invalidate(5, isIgnore = $$props.isIgnore);
    		if ("instance" in $$props) $$invalidate(6, instance = $$props.instance);
    		if ("effect" in $$props) $$subscribe_effect($$invalidate(0, effect = $$props.effect));
    		if ("augProps" in $$props) augProps = $$props.augProps;
    	};

    	let augProps;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*props*/ 2) {
    			// Make augProps reactive
    			 augProps = {
    				...props,
    				...props.dialogic
    				? {
    						dialogic: {
    							...props.dialogic,
    							id: props.dialogic.id || id
    						}
    					}
    				: { dialogic: { id } }
    			};
    		}

    		if ($$self.$$.dirty & /*deps, isIgnore, isShow, isHide*/ 60) {
    			 $$subscribe_effect($$invalidate(0, effect = useEffect(() => {

    				if (!isIgnore) {
    					if (isShow !== undefined) {
    						if (isShow) {
    							showInstance();
    						} else {
    							hideInstance();
    						}
    					} else if (isHide !== undefined) {
    						if (isHide) {
    							hideInstance();
    						}
    					}
    				}

    				return () => {
    					
    				}; // required
    			})));
    		}

    		if ($$self.$$.dirty & /*$effect*/ 256) ;
    	};

    	return [effect, props, isShow, isHide, deps, isIgnore, instance];
    }

    class UseDialogic extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance_1$1, create_fragment$5, safe_not_equal, {
    			props: 1,
    			isShow: 2,
    			isHide: 3,
    			deps: 4,
    			isIgnore: 5,
    			instance: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UseDialogic",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*props*/ ctx[1] === undefined && !("props" in props)) {
    			console.warn("<UseDialogic> was created without expected prop 'props'");
    		}

    		if (/*isShow*/ ctx[2] === undefined && !("isShow" in props)) {
    			console.warn("<UseDialogic> was created without expected prop 'isShow'");
    		}

    		if (/*isHide*/ ctx[3] === undefined && !("isHide" in props)) {
    			console.warn("<UseDialogic> was created without expected prop 'isHide'");
    		}

    		if (/*deps*/ ctx[4] === undefined && !("deps" in props)) {
    			console.warn("<UseDialogic> was created without expected prop 'deps'");
    		}

    		if (/*isIgnore*/ ctx[5] === undefined && !("isIgnore" in props)) {
    			console.warn("<UseDialogic> was created without expected prop 'isIgnore'");
    		}

    		if (/*instance*/ ctx[6] === undefined && !("instance" in props)) {
    			console.warn("<UseDialogic> was created without expected prop 'instance'");
    		}
    	}

    	get props() {
    		throw new Error("<UseDialogic>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set props(value) {
    		throw new Error("<UseDialogic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isShow() {
    		throw new Error("<UseDialogic>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isShow(value) {
    		throw new Error("<UseDialogic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isHide() {
    		throw new Error("<UseDialogic>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isHide(value) {
    		throw new Error("<UseDialogic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get deps() {
    		throw new Error("<UseDialogic>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set deps(value) {
    		throw new Error("<UseDialogic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isIgnore() {
    		throw new Error("<UseDialogic>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isIgnore(value) {
    		throw new Error("<UseDialogic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get instance() {
    		throw new Error("<UseDialogic>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set instance(value) {
    		throw new Error("<UseDialogic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* Users/arthur/code/Github Projects/dialogic/master/packages/dialogic-svelte/src/UseDialog.svelte generated by Svelte v3.25.0 */

    function create_fragment$6(ctx) {
    	let usedialogic;
    	let current;
    	const usedialogic_spread_levels = [{ instance: dialog }, /*$$props*/ ctx[0]];
    	let usedialogic_props = {};

    	for (let i = 0; i < usedialogic_spread_levels.length; i += 1) {
    		usedialogic_props = assign(usedialogic_props, usedialogic_spread_levels[i]);
    	}

    	usedialogic = new UseDialogic({ props: usedialogic_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(usedialogic.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(usedialogic, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const usedialogic_changes = (dirty & /*dialog, $$props*/ 1)
    			? get_spread_update(usedialogic_spread_levels, [
    					dirty & /*dialog*/ 0 && { instance: dialog },
    					dirty & /*$$props*/ 1 && get_spread_object(/*$$props*/ ctx[0])
    				])
    			: {};

    			usedialogic.$set(usedialogic_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(usedialogic.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(usedialogic.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(usedialogic, detaching);
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

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("UseDialog", slots, []);

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$capture_state = () => ({ dialog, UseDialogic });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class UseDialog extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UseDialog",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    function regexparam (str, loose) {
    	if (str instanceof RegExp) return { keys:false, pattern:str };
    	var c, o, tmp, ext, keys=[], pattern='', arr = str.split('/');
    	arr[0] || arr.shift();

    	while (tmp = arr.shift()) {
    		c = tmp[0];
    		if (c === '*') {
    			keys.push('wild');
    			pattern += '/(.*)';
    		} else if (c === ':') {
    			o = tmp.indexOf('?', 1);
    			ext = tmp.indexOf('.', 1);
    			keys.push( tmp.substring(1, !!~o ? o : !!~ext ? ext : tmp.length) );
    			pattern += !!~o && !~ext ? '(?:/([^/]+?))?' : '/([^/]+?)';
    			if (!!~ext) pattern += (!!~o ? '?' : '') + '\\' + tmp.substring(ext);
    		} else {
    			pattern += '/' + tmp;
    		}
    	}

    	return {
    		keys: keys,
    		pattern: new RegExp('^' + pattern + (loose ? '(?=$|\/)' : '\/?$'), 'i')
    	};
    }

    /* node_modules/svelte-spa-router/Router.svelte generated by Svelte v3.25.0 */

    const { Error: Error_1, Object: Object_1, console: console_1 } = globals;

    // (219:0) {:else}
    function create_else_block(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		return { $$inline: true };
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[5]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
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
    					switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[5]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
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
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(219:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (217:0) {#if componentParams}
    function create_if_block(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		return {
    			props: { params: /*componentParams*/ ctx[1] },
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    		switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[4]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};
    			if (dirty & /*componentParams*/ 2) switch_instance_changes.params = /*componentParams*/ ctx[1];

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[4]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
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
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(217:0) {#if componentParams}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*componentParams*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
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

    function wrap(route, userData, ...conditions) {
    	// Check if we don't have userData
    	if (userData && typeof userData == "function") {
    		conditions = conditions && conditions.length ? conditions : [];
    		conditions.unshift(userData);
    		userData = undefined;
    	}

    	// Parameter route and each item of conditions must be functions
    	if (!route || typeof route != "function") {
    		throw Error("Invalid parameter route");
    	}

    	if (conditions && conditions.length) {
    		for (let i = 0; i < conditions.length; i++) {
    			if (!conditions[i] || typeof conditions[i] != "function") {
    				throw Error("Invalid parameter conditions[" + i + "]");
    			}
    		}
    	}

    	// Returns an object that contains all the functions to execute too
    	const obj = { route, userData };

    	if (conditions && conditions.length) {
    		obj.conditions = conditions;
    	}

    	// The _sveltesparouter flag is to confirm the object was created by this router
    	Object.defineProperty(obj, "_sveltesparouter", { value: true });

    	return obj;
    }

    /**
     * @typedef {Object} Location
     * @property {string} location - Location (page/view), for example `/book`
     * @property {string} [querystring] - Querystring from the hash, as a string not parsed
     */
    /**
     * Returns the current location from the hash.
     *
     * @returns {Location} Location object
     * @private
     */
    function getLocation() {
    	const hashPosition = window.location.href.indexOf("#/");

    	let location = hashPosition > -1
    	? window.location.href.substr(hashPosition + 1)
    	: "/";

    	// Check if there's a querystring
    	const qsPosition = location.indexOf("?");

    	let querystring = "";

    	if (qsPosition > -1) {
    		querystring = location.substr(qsPosition + 1);
    		location = location.substr(0, qsPosition);
    	}

    	return { location, querystring };
    }

    const loc = readable(null, // eslint-disable-next-line prefer-arrow-callback
    function start(set) {
    	set(getLocation());

    	const update = () => {
    		set(getLocation());
    	};

    	window.addEventListener("hashchange", update, false);

    	return function stop() {
    		window.removeEventListener("hashchange", update, false);
    	};
    });

    const location = derived(loc, $loc => $loc.location);
    const querystring = derived(loc, $loc => $loc.querystring);

    function push(location) {
    	if (!location || location.length < 1 || location.charAt(0) != "/" && location.indexOf("#/") !== 0) {
    		throw Error("Invalid parameter location");
    	}

    	// Execute this code when the current call stack is complete
    	return tick().then(() => {
    		window.location.hash = (location.charAt(0) == "#" ? "" : "#") + location;
    	});
    }

    function pop() {
    	// Execute this code when the current call stack is complete
    	return tick().then(() => {
    		window.history.back();
    	});
    }

    function replace(location) {
    	if (!location || location.length < 1 || location.charAt(0) != "/" && location.indexOf("#/") !== 0) {
    		throw Error("Invalid parameter location");
    	}

    	// Execute this code when the current call stack is complete
    	return tick().then(() => {
    		const dest = (location.charAt(0) == "#" ? "" : "#") + location;

    		try {
    			window.history.replaceState(undefined, undefined, dest);
    		} catch(e) {
    			// eslint-disable-next-line no-console
    			console.warn("Caught exception while replacing the current page. If you're running this in the Svelte REPL, please note that the `replace` method might not work in this environment.");
    		}

    		// The method above doesn't trigger the hashchange event, so let's do that manually
    		window.dispatchEvent(new Event("hashchange"));
    	});
    }

    function link(node, hrefVar) {
    	// Only apply to <a> tags
    	if (!node || !node.tagName || node.tagName.toLowerCase() != "a") {
    		throw Error("Action \"link\" can only be used with <a> tags");
    	}

    	updateLink(node, hrefVar || node.getAttribute("href"));

    	return {
    		update(updated) {
    			updateLink(node, updated);
    		}
    	};
    }

    // Internal function used by the link function
    function updateLink(node, href) {
    	// Destination must start with '/'
    	if (!href || href.length < 1 || href.charAt(0) != "/") {
    		throw Error("Invalid value for \"href\" attribute");
    	}

    	// Add # to the href attribute
    	node.setAttribute("href", "#" + href);
    }

    function nextTickPromise(cb) {
    	// eslint-disable-next-line no-console
    	console.warn("nextTickPromise from 'svelte-spa-router' is deprecated and will be removed in version 3; use the 'tick' method from the Svelte runtime instead");

    	return tick().then(cb);
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let $loc,
    		$$unsubscribe_loc = noop;

    	validate_store(loc, "loc");
    	component_subscribe($$self, loc, $$value => $$invalidate(6, $loc = $$value));
    	$$self.$$.on_destroy.push(() => $$unsubscribe_loc());
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Router", slots, []);
    	let { routes = {} } = $$props;
    	let { prefix = "" } = $$props;

    	/**
     * Container for a route: path, component
     */
    	class RouteItem {
    		/**
     * Initializes the object and creates a regular expression from the path, using regexparam.
     *
     * @param {string} path - Path to the route (must start with '/' or '*')
     * @param {SvelteComponent} component - Svelte component for the route
     */
    		constructor(path, component) {
    			if (!component || typeof component != "function" && (typeof component != "object" || component._sveltesparouter !== true)) {
    				throw Error("Invalid component object");
    			}

    			// Path must be a regular or expression, or a string starting with '/' or '*'
    			if (!path || typeof path == "string" && (path.length < 1 || path.charAt(0) != "/" && path.charAt(0) != "*") || typeof path == "object" && !(path instanceof RegExp)) {
    				throw Error("Invalid value for \"path\" argument");
    			}

    			const { pattern, keys } = regexparam(path);
    			this.path = path;

    			// Check if the component is wrapped and we have conditions
    			if (typeof component == "object" && component._sveltesparouter === true) {
    				this.component = component.route;
    				this.conditions = component.conditions || [];
    				this.userData = component.userData;
    			} else {
    				this.component = component;
    				this.conditions = [];
    				this.userData = undefined;
    			}

    			this._pattern = pattern;
    			this._keys = keys;
    		}

    		/**
     * Checks if `path` matches the current route.
     * If there's a match, will return the list of parameters from the URL (if any).
     * In case of no match, the method will return `null`.
     *
     * @param {string} path - Path to test
     * @returns {null|Object.<string, string>} List of paramters from the URL if there's a match, or `null` otherwise.
     */
    		match(path) {
    			// If there's a prefix, remove it before we run the matching
    			if (prefix && path.startsWith(prefix)) {
    				path = path.substr(prefix.length) || "/";
    			}

    			// Check if the pattern matches
    			const matches = this._pattern.exec(path);

    			if (matches === null) {
    				return null;
    			}

    			// If the input was a regular expression, this._keys would be false, so return matches as is
    			if (this._keys === false) {
    				return matches;
    			}

    			const out = {};
    			let i = 0;

    			while (i < this._keys.length) {
    				out[this._keys[i]] = matches[++i] || null;
    			}

    			return out;
    		}

    		/**
     * Dictionary with route details passed to the pre-conditions functions, as well as the `routeLoaded` and `conditionsFailed` events
     * @typedef {Object} RouteDetail
     * @property {SvelteComponent} component - Svelte component
     * @property {string} name - Name of the Svelte component
     * @property {string} location - Location path
     * @property {string} querystring - Querystring from the hash
     * @property {Object} [userData] - Custom data passed by the user
     */
    		/**
     * Executes all conditions (if any) to control whether the route can be shown. Conditions are executed in the order they are defined, and if a condition fails, the following ones aren't executed.
     * 
     * @param {RouteDetail} detail - Route detail
     * @returns {bool} Returns true if all the conditions succeeded
     */
    		checkConditions(detail) {
    			for (let i = 0; i < this.conditions.length; i++) {
    				if (!this.conditions[i](detail)) {
    					return false;
    				}
    			}

    			return true;
    		}
    	}

    	// Set up all routes
    	const routesList = [];

    	if (routes instanceof Map) {
    		// If it's a map, iterate on it right away
    		routes.forEach((route, path) => {
    			routesList.push(new RouteItem(path, route));
    		});
    	} else {
    		// We have an object, so iterate on its own properties
    		Object.keys(routes).forEach(path => {
    			routesList.push(new RouteItem(path, routes[path]));
    		});
    	}

    	// Props for the component to render
    	let component = null;

    	let componentParams = null;

    	// Event dispatcher from Svelte
    	const dispatch = createEventDispatcher();

    	// Just like dispatch, but executes on the next iteration of the event loop
    	const dispatchNextTick = (name, detail) => {
    		// Execute this code when the current call stack is complete
    		tick().then(() => {
    			dispatch(name, detail);
    		});
    	};

    	const writable_props = ["routes", "prefix"];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	function routeEvent_handler(event) {
    		bubble($$self, event);
    	}

    	function routeEvent_handler_1(event) {
    		bubble($$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ("routes" in $$props) $$invalidate(2, routes = $$props.routes);
    		if ("prefix" in $$props) $$invalidate(3, prefix = $$props.prefix);
    	};

    	$$self.$capture_state = () => ({
    		readable,
    		derived,
    		tick,
    		wrap,
    		getLocation,
    		loc,
    		location,
    		querystring,
    		push,
    		pop,
    		replace,
    		link,
    		updateLink,
    		nextTickPromise,
    		createEventDispatcher,
    		regexparam,
    		routes,
    		prefix,
    		RouteItem,
    		routesList,
    		component,
    		componentParams,
    		dispatch,
    		dispatchNextTick,
    		$loc
    	});

    	$$self.$inject_state = $$props => {
    		if ("routes" in $$props) $$invalidate(2, routes = $$props.routes);
    		if ("prefix" in $$props) $$invalidate(3, prefix = $$props.prefix);
    		if ("component" in $$props) $$invalidate(0, component = $$props.component);
    		if ("componentParams" in $$props) $$invalidate(1, componentParams = $$props.componentParams);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*component, $loc*/ 65) {
    			// Handle hash change events
    			// Listen to changes in the $loc store and update the page
    			 {
    				// Find a route matching the location
    				$$invalidate(0, component = null);

    				let i = 0;

    				while (!component && i < routesList.length) {
    					const match = routesList[i].match($loc.location);

    					if (match) {
    						const detail = {
    							component: routesList[i].component,
    							name: routesList[i].component.name,
    							location: $loc.location,
    							querystring: $loc.querystring,
    							userData: routesList[i].userData
    						};

    						// Check if the route can be loaded - if all conditions succeed
    						if (!routesList[i].checkConditions(detail)) {
    							// Trigger an event to notify the user
    							dispatchNextTick("conditionsFailed", detail);

    							break;
    						}

    						$$invalidate(0, component = routesList[i].component);

    						// Set componentParams onloy if we have a match, to avoid a warning similar to `<Component> was created with unknown prop 'params'`
    						// Of course, this assumes that developers always add a "params" prop when they are expecting parameters
    						if (match && typeof match == "object" && Object.keys(match).length) {
    							$$invalidate(1, componentParams = match);
    						} else {
    							$$invalidate(1, componentParams = null);
    						}

    						dispatchNextTick("routeLoaded", detail);
    					}

    					i++;
    				}
    			}
    		}
    	};

    	return [
    		component,
    		componentParams,
    		routes,
    		prefix,
    		routeEvent_handler,
    		routeEvent_handler_1
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$7, safe_not_equal, { routes: 2, prefix: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get routes() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set routes(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get prefix() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set prefix(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/CurrentPathBadge.svelte generated by Svelte v3.25.0 */
    const file$1 = "src/CurrentPathBadge.svelte";

    function create_fragment$8(ctx) {
    	let div;
    	let span;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			t = text(/*$location*/ ctx[0]);
    			attr_dev(span, "class", "tag");
    			attr_dev(span, "data-test-id", "current-path");
    			add_location(span, file$1, 5, 2, 105);
    			attr_dev(div, "class", "control path-control");
    			add_location(div, file$1, 4, 0, 68);
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
    			if (dirty & /*$location*/ 1) set_data_dev(t, /*$location*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
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

    function instance$6($$self, $$props, $$invalidate) {
    	let $location;
    	validate_store(location, "location");
    	component_subscribe($$self, location, $$value => $$invalidate(0, $location = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("CurrentPathBadge", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<CurrentPathBadge> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ location, $location });
    	return [$location];
    }

    class CurrentPathBadge extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CurrentPathBadge",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src/HomePage.svelte generated by Svelte v3.25.0 */
    const file$2 = "src/HomePage.svelte";

    function create_fragment$9(ctx) {
    	let div1;
    	let h1;
    	let t1;
    	let currentpathbadge;
    	let t2;
    	let p;
    	let t3;
    	let code;
    	let t5;
    	let t6;
    	let div0;
    	let a;
    	let a_href_value;
    	let link_action;
    	let current;
    	let mounted;
    	let dispose;
    	currentpathbadge = new CurrentPathBadge({ $$inline: true });

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Home";
    			t1 = space();
    			create_component(currentpathbadge.$$.fragment);
    			t2 = space();
    			p = element("p");
    			t3 = text("This demo shows\n    ");
    			code = element("code");
    			code.textContent = "UseDialog";
    			t5 = text("\n    that allows for a declarative way of controlling dialogs. The Profile dialog\n    responds to the route, and is automatically hidden when using the browser's\n    back button.");
    			t6 = space();
    			div0 = element("div");
    			a = element("a");
    			a.textContent = "Go to Profile";
    			attr_dev(h1, "class", "title");
    			add_location(h1, file$2, 6, 2, 157);
    			add_location(code, file$2, 10, 4, 252);
    			attr_dev(p, "class", "intro");
    			add_location(p, file$2, 8, 2, 210);
    			attr_dev(a, "class", "button is-link");
    			attr_dev(a, "href", a_href_value = "/profile");
    			attr_dev(a, "data-test-id", "btn-profile");
    			add_location(a, file$2, 16, 4, 488);
    			attr_dev(div0, "class", "buttons");
    			add_location(div0, file$2, 15, 2, 462);
    			attr_dev(div1, "data-test-id", "home-page");
    			add_location(div1, file$2, 5, 0, 124);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h1);
    			append_dev(div1, t1);
    			mount_component(currentpathbadge, div1, null);
    			append_dev(div1, t2);
    			append_dev(div1, p);
    			append_dev(p, t3);
    			append_dev(p, code);
    			append_dev(p, t5);
    			append_dev(div1, t6);
    			append_dev(div1, div0);
    			append_dev(div0, a);
    			current = true;

    			if (!mounted) {
    				dispose = action_destroyer(link_action = link.call(null, a));
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(currentpathbadge.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(currentpathbadge.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(currentpathbadge);
    			mounted = false;
    			dispose();
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("HomePage", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<HomePage> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ CurrentPathBadge, link });
    	return [];
    }

    class HomePage extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HomePage",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src/EditProfileDialog.svelte generated by Svelte v3.25.0 */
    const file$3 = "src/EditProfileDialog.svelte";

    function create_fragment$a(ctx) {
    	let div4;
    	let div0;
    	let t0;
    	let form;
    	let header;
    	let p;
    	let t1;
    	let t2;
    	let button0;
    	let t3;
    	let section;
    	let div2;
    	let div1;
    	let input;
    	let t4;
    	let footer;
    	let div3;
    	let button1;
    	let t6;
    	let a;
    	let link_action;
    	let t8;
    	let button2;
    	let t10;
    	let button3;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div0 = element("div");
    			t0 = space();
    			form = element("form");
    			header = element("header");
    			p = element("p");
    			t1 = text(/*title*/ ctx[0]);
    			t2 = space();
    			button0 = element("button");
    			t3 = space();
    			section = element("section");
    			div2 = element("div");
    			div1 = element("div");
    			input = element("input");
    			t4 = space();
    			footer = element("footer");
    			div3 = element("div");
    			button1 = element("button");
    			button1.textContent = "Save changes";
    			t6 = space();
    			a = element("a");
    			a.textContent = "Go to Home";
    			t8 = space();
    			button2 = element("button");
    			button2.textContent = "Dynamic title count";
    			t10 = space();
    			button3 = element("button");
    			button3.textContent = "Cancel";
    			attr_dev(div0, "class", "modal-background");
    			add_location(div0, file$3, 13, 2, 265);
    			attr_dev(p, "class", "modal-card-title");
    			attr_dev(p, "data-test-id", "title");
    			add_location(p, file$3, 16, 6, 404);
    			attr_dev(button0, "class", "delete");
    			attr_dev(button0, "data-test-id", "btn-close");
    			add_location(button0, file$3, 17, 6, 471);
    			attr_dev(header, "class", "modal-card-head");
    			add_location(header, file$3, 15, 4, 365);
    			attr_dev(input, "class", "input");
    			attr_dev(input, "type", "text");
    			attr_dev(input, "data-test-id", "input-email");
    			add_location(input, file$3, 22, 10, 660);
    			attr_dev(div1, "class", "control");
    			add_location(div1, file$3, 21, 8, 628);
    			attr_dev(div2, "class", "field");
    			add_location(div2, file$3, 20, 6, 600);
    			attr_dev(section, "class", "modal-card-body");
    			add_location(section, file$3, 19, 4, 560);
    			attr_dev(button1, "type", "submit");
    			attr_dev(button1, "class", "button is-link");
    			attr_dev(button1, "data-test-id", "btn-save");
    			add_location(button1, file$3, 32, 8, 916);
    			attr_dev(a, "class", "button is-link is-light is-outlined");
    			attr_dev(a, "href", "/");
    			attr_dev(a, "data-test-id", "btn-home");
    			add_location(a, file$3, 39, 8, 1109);
    			attr_dev(button2, "type", "button");
    			attr_dev(button2, "class", "button is-link is-light is-outlined");
    			attr_dev(button2, "data-test-id", "btn-add-count");
    			add_location(button2, file$3, 46, 8, 1281);
    			attr_dev(button3, "type", "button");
    			attr_dev(button3, "class", "button is-danger is-light is-outlined");
    			attr_dev(button3, "data-test-id", "btn-cancel");
    			add_location(button3, file$3, 53, 8, 1494);
    			attr_dev(div3, "class", "footer-buttons");
    			add_location(div3, file$3, 31, 6, 879);
    			attr_dev(footer, "class", "modal-card-foot");
    			add_location(footer, file$3, 30, 4, 840);
    			attr_dev(form, "class", "modal-card");
    			add_location(form, file$3, 14, 2, 300);
    			attr_dev(div4, "class", "modal is-active");
    			attr_dev(div4, "data-test-id", "edit-profile-dialog");
    			add_location(div4, file$3, 12, 0, 198);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div0);
    			append_dev(div4, t0);
    			append_dev(div4, form);
    			append_dev(form, header);
    			append_dev(header, p);
    			append_dev(p, t1);
    			append_dev(header, t2);
    			append_dev(header, button0);
    			append_dev(form, t3);
    			append_dev(form, section);
    			append_dev(section, div2);
    			append_dev(div2, div1);
    			append_dev(div1, input);
    			set_input_value(input, /*newEmail*/ ctx[4]);
    			append_dev(form, t4);
    			append_dev(form, footer);
    			append_dev(footer, div3);
    			append_dev(div3, button1);
    			append_dev(div3, t6);
    			append_dev(div3, a);
    			append_dev(div3, t8);
    			append_dev(div3, button2);
    			append_dev(div3, t10);
    			append_dev(div3, button3);

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						button0,
    						"click",
    						function () {
    							if (is_function(/*onCancel*/ ctx[2])) /*onCancel*/ ctx[2].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(input, "input", /*input_input_handler*/ ctx[6]),
    					listen_dev(button1, "click", /*click_handler*/ ctx[7], false, false, false),
    					action_destroyer(link_action = link.call(null, a)),
    					listen_dev(
    						button2,
    						"click",
    						function () {
    							if (is_function(/*increment*/ ctx[3])) /*increment*/ ctx[3].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						button3,
    						"click",
    						function () {
    							if (is_function(/*onCancel*/ ctx[2])) /*onCancel*/ ctx[2].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(form, "submit", /*submit_handler*/ ctx[8], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			if (dirty & /*title*/ 1) set_data_dev(t1, /*title*/ ctx[0]);

    			if (dirty & /*newEmail*/ 16 && input.value !== /*newEmail*/ ctx[4]) {
    				set_input_value(input, /*newEmail*/ ctx[4]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			mounted = false;
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("EditProfileDialog", slots, []);
    	let { title } = $$props;
    	let { email } = $$props;
    	let { onSave } = $$props;
    	let { onCancel } = $$props;
    	let { increment } = $$props;
    	let newEmail = email;
    	const writable_props = ["title", "email", "onSave", "onCancel", "increment"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<EditProfileDialog> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		newEmail = this.value;
    		$$invalidate(4, newEmail);
    	}

    	const click_handler = () => onSave(newEmail);
    	const submit_handler = () => onSave(newEmail);

    	$$self.$$set = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    		if ("email" in $$props) $$invalidate(5, email = $$props.email);
    		if ("onSave" in $$props) $$invalidate(1, onSave = $$props.onSave);
    		if ("onCancel" in $$props) $$invalidate(2, onCancel = $$props.onCancel);
    		if ("increment" in $$props) $$invalidate(3, increment = $$props.increment);
    	};

    	$$self.$capture_state = () => ({
    		link,
    		title,
    		email,
    		onSave,
    		onCancel,
    		increment,
    		newEmail
    	});

    	$$self.$inject_state = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    		if ("email" in $$props) $$invalidate(5, email = $$props.email);
    		if ("onSave" in $$props) $$invalidate(1, onSave = $$props.onSave);
    		if ("onCancel" in $$props) $$invalidate(2, onCancel = $$props.onCancel);
    		if ("increment" in $$props) $$invalidate(3, increment = $$props.increment);
    		if ("newEmail" in $$props) $$invalidate(4, newEmail = $$props.newEmail);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		title,
    		onSave,
    		onCancel,
    		increment,
    		newEmail,
    		email,
    		input_input_handler,
    		click_handler,
    		submit_handler
    	];
    }

    class EditProfileDialog extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$8, create_fragment$a, safe_not_equal, {
    			title: 0,
    			email: 5,
    			onSave: 1,
    			onCancel: 2,
    			increment: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "EditProfileDialog",
    			options,
    			id: create_fragment$a.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*title*/ ctx[0] === undefined && !("title" in props)) {
    			console.warn("<EditProfileDialog> was created without expected prop 'title'");
    		}

    		if (/*email*/ ctx[5] === undefined && !("email" in props)) {
    			console.warn("<EditProfileDialog> was created without expected prop 'email'");
    		}

    		if (/*onSave*/ ctx[1] === undefined && !("onSave" in props)) {
    			console.warn("<EditProfileDialog> was created without expected prop 'onSave'");
    		}

    		if (/*onCancel*/ ctx[2] === undefined && !("onCancel" in props)) {
    			console.warn("<EditProfileDialog> was created without expected prop 'onCancel'");
    		}

    		if (/*increment*/ ctx[3] === undefined && !("increment" in props)) {
    			console.warn("<EditProfileDialog> was created without expected prop 'increment'");
    		}
    	}

    	get title() {
    		throw new Error("<EditProfileDialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<EditProfileDialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get email() {
    		throw new Error("<EditProfileDialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set email(value) {
    		throw new Error("<EditProfileDialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onSave() {
    		throw new Error("<EditProfileDialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onSave(value) {
    		throw new Error("<EditProfileDialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onCancel() {
    		throw new Error("<EditProfileDialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onCancel(value) {
    		throw new Error("<EditProfileDialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get increment() {
    		throw new Error("<EditProfileDialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set increment(value) {
    		throw new Error("<EditProfileDialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const email = writable('allan@company.com');
    const counter = writable(0);
    const increment = () => counter.update(n => n + 1);

    /* src/SaveConfirmation.svelte generated by Svelte v3.25.0 */

    const file$4 = "src/SaveConfirmation.svelte";

    function create_fragment$b(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*content*/ ctx[0]);
    			attr_dev(div, "class", "notification-content");
    			attr_dev(div, "data-test-id", "notification");
    			add_location(div, file$4, 34, 0, 870);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*content*/ 1) set_data_dev(t, /*content*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const createSaveConfirmationProps = SaveConfirmationComponent => ({
    	dialogic: {
    		component: SaveConfirmationComponent,
    		className: "demo-notification",
    		styles: domElement => {
    			const height = domElement.getBoundingClientRect().height;

    			return {
    				default: { transition: "all 350ms ease-in-out" },
    				showStart: {
    					transform: `translate3d(0, ${height}px, 0)`
    				},
    				showEnd: {
    					transform: "translate3d(0, 0px,  0)",
    					transitionDelay: "500ms"
    				},
    				hideEnd: {
    					transitionDuration: "450ms",
    					transform: `translate3d(0, ${height}px, 0)`
    				}
    			};
    		}
    	},
    	content: "E-mail address updated"
    });

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("SaveConfirmation", slots, []);
    	let { content } = $$props;
    	const writable_props = ["content"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SaveConfirmation> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("content" in $$props) $$invalidate(0, content = $$props.content);
    	};

    	$$self.$capture_state = () => ({ createSaveConfirmationProps, content });

    	$$self.$inject_state = $$props => {
    		if ("content" in $$props) $$invalidate(0, content = $$props.content);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [content];
    }

    class SaveConfirmation extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$b, safe_not_equal, { content: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SaveConfirmation",
    			options,
    			id: create_fragment$b.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*content*/ ctx[0] === undefined && !("content" in props)) {
    			console.warn("<SaveConfirmation> was created without expected prop 'content'");
    		}
    	}

    	get content() {
    		throw new Error("<SaveConfirmation>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set content(value) {
    		throw new Error("<SaveConfirmation>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/ProfilePage.svelte generated by Svelte v3.25.0 */

    const file$5 = "src/ProfilePage.svelte";

    function create_fragment$c(ctx) {
    	let div4;
    	let h1;
    	let t1;
    	let currentpathbadge;
    	let t2;
    	let div2;
    	let div0;
    	let strong;
    	let t4;
    	let div1;
    	let t5;
    	let t6;
    	let a0;
    	let t7;
    	let link_action;
    	let t8;
    	let div3;
    	let a1;
    	let a1_href_value;
    	let link_action_1;
    	let t10;
    	let usedialog;
    	let current;
    	let mounted;
    	let dispose;
    	currentpathbadge = new CurrentPathBadge({ $$inline: true });

    	usedialog = new UseDialog({
    			props: {
    				props: /*useDialogProps*/ ctx[1],
    				isShow: /*isMatchDialogPath*/ ctx[0],
    				deps: [/*$counter*/ ctx[2]]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Profile";
    			t1 = space();
    			create_component(currentpathbadge.$$.fragment);
    			t2 = space();
    			div2 = element("div");
    			div0 = element("div");
    			strong = element("strong");
    			strong.textContent = "Email";
    			t4 = space();
    			div1 = element("div");
    			t5 = text(/*$email*/ ctx[3]);
    			t6 = space();
    			a0 = element("a");
    			t7 = text("Edit");
    			t8 = space();
    			div3 = element("div");
    			a1 = element("a");
    			a1.textContent = "Go to Home";
    			t10 = space();
    			create_component(usedialog.$$.fragment);
    			attr_dev(h1, "class", "title");
    			add_location(h1, file$5, 41, 2, 1321);
    			add_location(strong, file$5, 46, 6, 1421);
    			add_location(div0, file$5, 45, 4, 1409);
    			attr_dev(div1, "data-test-id", "current-email");
    			add_location(div1, file$5, 48, 4, 1459);
    			attr_dev(a0, "class", "button is-link");
    			attr_dev(a0, "href", dialogPath);
    			attr_dev(a0, "data-test-id", "btn-edit-profile");
    			add_location(a0, file$5, 49, 4, 1512);
    			attr_dev(div2, "class", "profile-tile");
    			add_location(div2, file$5, 44, 2, 1378);
    			attr_dev(a1, "class", "button is-link is-light is-outlined");
    			attr_dev(a1, "href", a1_href_value = "/");
    			attr_dev(a1, "data-test-id", "btn-home");
    			add_location(a1, file$5, 59, 4, 1680);
    			attr_dev(div3, "class", "buttons");
    			add_location(div3, file$5, 58, 2, 1654);
    			attr_dev(div4, "data-test-id", "profile-page");
    			add_location(div4, file$5, 40, 0, 1285);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, h1);
    			append_dev(div4, t1);
    			mount_component(currentpathbadge, div4, null);
    			append_dev(div4, t2);
    			append_dev(div4, div2);
    			append_dev(div2, div0);
    			append_dev(div0, strong);
    			append_dev(div2, t4);
    			append_dev(div2, div1);
    			append_dev(div1, t5);
    			append_dev(div2, t6);
    			append_dev(div2, a0);
    			append_dev(a0, t7);
    			append_dev(div4, t8);
    			append_dev(div4, div3);
    			append_dev(div3, a1);
    			append_dev(div4, t10);
    			mount_component(usedialog, div4, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(link_action = link.call(null, a0)),
    					action_destroyer(link_action_1 = link.call(null, a1))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*$email*/ 8) set_data_dev(t5, /*$email*/ ctx[3]);
    			const usedialog_changes = {};
    			if (dirty & /*useDialogProps*/ 2) usedialog_changes.props = /*useDialogProps*/ ctx[1];
    			if (dirty & /*isMatchDialogPath*/ 1) usedialog_changes.isShow = /*isMatchDialogPath*/ ctx[0];
    			if (dirty & /*$counter*/ 4) usedialog_changes.deps = [/*$counter*/ ctx[2]];
    			usedialog.$set(usedialog_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(currentpathbadge.$$.fragment, local);
    			transition_in(usedialog.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(currentpathbadge.$$.fragment, local);
    			transition_out(usedialog.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			destroy_component(currentpathbadge);
    			destroy_component(usedialog);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const dialogPath = "/profile/edit";
    const dialogReturnPath = "/profile";

    function instance$a($$self, $$props, $$invalidate) {
    	let $location;
    	let $counter;
    	let $email;
    	validate_store(location, "location");
    	component_subscribe($$self, location, $$value => $$invalidate(4, $location = $$value));
    	validate_store(counter, "counter");
    	component_subscribe($$self, counter, $$value => $$invalidate(2, $counter = $$value));
    	validate_store(email, "email");
    	component_subscribe($$self, email, $$value => $$invalidate(3, $email = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ProfilePage", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ProfilePage> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		CurrentPathBadge,
    		EditProfileDialog,
    		UseDialog,
    		notification: notification$1,
    		link,
    		location,
    		push,
    		writable,
    		email,
    		counter,
    		increment,
    		SaveConfirmation,
    		createSaveConfirmationProps,
    		dialogPath,
    		dialogReturnPath,
    		isMatchDialogPath,
    		$location,
    		useDialogProps,
    		$counter,
    		$email
    	});

    	$$self.$inject_state = $$props => {
    		if ("isMatchDialogPath" in $$props) $$invalidate(0, isMatchDialogPath = $$props.isMatchDialogPath);
    		if ("useDialogProps" in $$props) $$invalidate(1, useDialogProps = $$props.useDialogProps);
    	};

    	let isMatchDialogPath;
    	let useDialogProps;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$location*/ 16) {
    			 $$invalidate(0, isMatchDialogPath = $location === dialogPath);
    		}

    		if ($$self.$$.dirty & /*$counter, $email*/ 12) {
    			// UseDialog props
    			// Make props reactive so that the title gets updated with changes to counter
    			 $$invalidate(1, useDialogProps = {
    				dialogic: {
    					component: EditProfileDialog,
    					className: "dialog"
    				},
    				title: `Update your e-mail ${$counter}`,
    				email: $email,
    				onSave: newEmail => {
    					if (newEmail !== $email) {
    						email.set(newEmail);
    						notification$1.show(createSaveConfirmationProps(SaveConfirmation));
    					}

    					push(dialogReturnPath);
    				},
    				onCancel: () => {
    					push(dialogReturnPath); // we could also pass dialogReturnPath to the dialog to use it as a link href
    				},
    				increment
    			});
    		}
    	};

    	return [isMatchDialogPath, useDialogProps, $counter, $email];
    }

    class ProfilePage extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ProfilePage",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    var routes = {
        '/': HomePage,
        '/profile/:edit?': ProfilePage,
    };

    /* src/App.svelte generated by Svelte v3.25.0 */
    const file$6 = "src/App.svelte";

    function create_fragment$d(ctx) {
    	let div;
    	let router;
    	let t0;
    	let dialog;
    	let t1;
    	let notification;
    	let current;
    	router = new Router({ props: { routes }, $$inline: true });
    	dialog = new Dialog({ $$inline: true });
    	notification = new Notification({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(router.$$.fragment);
    			t0 = space();
    			create_component(dialog.$$.fragment);
    			t1 = space();
    			create_component(notification.$$.fragment);
    			attr_dev(div, "class", "app");
    			add_location(div, file$6, 7, 0, 207);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(router, div, null);
    			append_dev(div, t0);
    			mount_component(dialog, div, null);
    			append_dev(div, t1);
    			mount_component(notification, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			transition_in(dialog.$$.fragment, local);
    			transition_in(notification.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			transition_out(dialog.$$.fragment, local);
    			transition_out(notification.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(router);
    			destroy_component(dialog);
    			destroy_component(notification);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Dialog, Notification, Router, routes });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    var app = new App({
        target: document.body
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
