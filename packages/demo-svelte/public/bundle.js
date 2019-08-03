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
    function subscribe(component, store, callback) {
        const unsub = store.subscribe(callback);
        component.$$.on_destroy.push(unsub.unsubscribe
            ? () => unsub.unsubscribe()
            : unsub);
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
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_binding_callback(fn) {
        binding_callbacks.push(fn);
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
            while (render_callbacks.length) {
                const callback = render_callbacks.pop();
                if (!seen_callbacks.has(callback)) {
                    callback();
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                }
            }
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
    }
    function update($$) {
        if ($$.fragment) {
            $$.update($$.dirty);
            run_all($$.before_render);
            $$.fragment.p($$.dirty, $$.ctx);
            $$.dirty = null;
            $$.after_render.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            remaining: 0,
            callbacks: []
        };
    }
    function check_outros() {
        if (!outros.remaining) {
            run_all(outros.callbacks);
        }
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.callbacks.push(() => {
                outroing.delete(block);
                if (callback) {
                    block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, () => {
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
        const { fragment, on_mount, on_destroy, after_render } = component.$$;
        fragment.m(target, anchor);
        // onMount happens after the initial afterUpdate. Because
        // afterUpdate callbacks happen in reverse order (inner first)
        // we schedule onMount callbacks before afterUpdate callbacks
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
        after_render.forEach(add_render_callback);
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
    function init(component, options, instance, create_fragment, not_equal$$1, prop_names) {
        const parent_component = current_component;
        set_current_component(component);
        const props = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props: prop_names,
            update: noop,
            not_equal: not_equal$$1,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_render: [],
            after_render: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty: null
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, props, (key, value) => {
                if ($$.ctx && not_equal$$1($$.ctx[key], $$.ctx[key] = value)) {
                    if ($$.bound[key])
                        $$.bound[key](value);
                    if (ready)
                        make_dirty(component, key);
                }
            })
            : props;
        $$.update();
        ready = true;
        run_all($$.before_render);
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
        transitionClass: true,
        showClass: true,
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
                if (props.transitionClass) {
                    domElement.classList.add(props.transitionClass);
                }
                if (props.showClass) {
                    const showClassElement = props.showClassElement || domElement;
                    showClassElement.classList[isShow ? "add" : "remove"](props.showClass);
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
                if (props.transitionClass) {
                    domElement.classList.remove(props.transitionClass);
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
        console.log("createInstance", ns);
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
    const count = (ns) => getCount(ns);
    const transitionItem = (item, mode) => {
        return transition({
            ...item.transitionOptions,
            ...item.instanceTransitionOptions
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
    //# sourceMappingURL=dialogic.mjs.map

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
                if (!stop) {
                    return; // not ready
                }
                subscribers.forEach((s) => s[1]());
                subscribers.forEach((s) => s[0](value));
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
        const invalidators = [];
        const store = readable(initial_value, (set) => {
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
                run_all(invalidators);
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
        return {
            subscribe(run, invalidate = noop) {
                invalidators.push(invalidate);
                const unsubscribe = store.subscribe(run, invalidate);
                return () => {
                    const index = invalidators.indexOf(invalidate);
                    if (index !== -1) {
                        invalidators.splice(index, 1);
                    }
                    unsubscribe();
                };
            }
        };
    }

    const appState = {
        ...writable(states),
        ...selectors
    };
    states.map(state => appState.set({
        ...state,
        ...selectors
    }));
    const getCount$1 = (ns) => derived(appState, () => selectors.getCount(ns));

    const notification$1 = {
        ...notification,
        count: getCount$1(notification.ns)
    };

    /* src/notification/NotificationInstance.svelte generated by Svelte v3.6.2 */

    const file = "src/notification/NotificationInstance.svelte";

    function create_fragment(ctx) {
    	var div, t0, t1, t2, button, dispose;

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
    			t0 = text("Notification\n  ");
    			t1 = text(ctx.title);
    			t2 = space();
    			button = element("button");
    			button.textContent = "hide from instance";
    			add_location(button, file, 71, 2, 1309);
    			set_attributes(div, div_data);
    			add_location(div, file, 64, 0, 1206);
    			dispose = listen(button, "click", ctx.hide);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);
    			append(div, t0);
    			append(div, t1);
    			append(div, t2);
    			append(div, button);
    			add_binding_callback(() => ctx.div_binding(div));
    		},

    		p: function update(changed, ctx) {
    			if (changed.title) {
    				set_data(t1, ctx.title);
    			}

    			set_attributes(div, get_spread_update(div_levels, [
    				(changed.R_classNames) && { class: ctx.R_classNames },
    				(changed.elementProps) && ctx.elementProps
    			]));
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}

    			ctx.div_binding(null);
    			dispose();
    		}
    	};
    }

    function instance($$self, $$props, $$invalidate) {
    	const dispatch = createEventDispatcher();

      // DOM bindings
      let domElement;

      let { id = undefined, title = "", spawnOptions = undefined, instanceOptions = undefined, className = "", showClass = "xxx--visible" } = $$props;

      const dispatchTransition = name =>
        dispatch(name, {
          spawnOptions,
          transitionOptions: {
            showClass,
            domElements: {
              domElement
            }
          },
        });

      const hide = e => {
        dispatchTransition("hide");
      };

      onMount(() => {
        dispatchTransition("mount");
      });

    	const writable_props = ['id', 'title', 'spawnOptions', 'instanceOptions', 'className', 'showClass'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<NotificationInstance> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		domElement = $$value;
    		$$invalidate('domElement', domElement);
    	}

    	$$self.$set = $$props => {
    		if ('id' in $$props) $$invalidate('id', id = $$props.id);
    		if ('title' in $$props) $$invalidate('title', title = $$props.title);
    		if ('spawnOptions' in $$props) $$invalidate('spawnOptions', spawnOptions = $$props.spawnOptions);
    		if ('instanceOptions' in $$props) $$invalidate('instanceOptions', instanceOptions = $$props.instanceOptions);
    		if ('className' in $$props) $$invalidate('className', className = $$props.className);
    		if ('showClass' in $$props) $$invalidate('showClass', showClass = $$props.showClass);
    	};

    	let R_classNames, elementProps;

    	$$self.$$.update = ($$dirty = { className: 1, R_classNames: 1 }) => {
    		if ($$dirty.className) { $$invalidate('R_classNames', R_classNames = [
            "xxx",
            className
        	].join(" ")); }
    		if ($$dirty.R_classNames) { $$invalidate('elementProps', elementProps = {
            class: R_classNames,
          }); }
    	};

    	return {
    		domElement,
    		id,
    		title,
    		spawnOptions,
    		instanceOptions,
    		className,
    		showClass,
    		hide,
    		R_classNames,
    		elementProps,
    		div_binding
    	};
    }

    class NotificationInstance extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, ["id", "title", "spawnOptions", "instanceOptions", "className", "showClass"]);
    	}

    	get id() {
    		throw new Error("<NotificationInstance>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<NotificationInstance>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<NotificationInstance>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<NotificationInstance>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get spawnOptions() {
    		throw new Error("<NotificationInstance>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spawnOptions(value) {
    		throw new Error("<NotificationInstance>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get instanceOptions() {
    		throw new Error("<NotificationInstance>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set instanceOptions(value) {
    		throw new Error("<NotificationInstance>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get className() {
    		throw new Error("<NotificationInstance>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set className(value) {
    		throw new Error("<NotificationInstance>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get showClass() {
    		throw new Error("<NotificationInstance>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set showClass(value) {
    		throw new Error("<NotificationInstance>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

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
    const onInstanceMounted = (ns) => (event) => handleDispatch(ns)(event, showItem);
    const onShowInstance = (ns) => (event) => handleDispatch(ns)(event, showItem);
    const onHideInstance = (ns) => (event) => handleDispatch(ns)(event, hideItem);

    /* src/dialogic/Dialogic.svelte generated by Svelte v3.6.2 */

    function get_each_context(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.spawnOptions = list[i].spawnOptions;
    	child_ctx.instanceOptions = list[i].instanceOptions;
    	child_ctx.key = list[i].key;
    	child_ctx.index = i;
    	return child_ctx;
    }

    // (18:0) {#each filter($appState.store, spawnOptions.spawn, ns) as { spawnOptions, instanceOptions, key }
    function create_each_block(key_1, ctx) {
    	var first, current;

    	var instance_spread_levels = [
    		ctx.instanceOptions,
    		{ spawnOptions: ctx.spawnOptions }
    	];

    	let instance_props = {};
    	for (var i = 0; i < instance_spread_levels.length; i += 1) {
    		instance_props = assign(instance_props, instance_spread_levels[i]);
    	}
    	var instance = new ctx.Instance({ props: instance_props, $$inline: true });
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
    			var instance_changes = (changed.filter || changed.$appState || changed.spawnOptions || changed.ns) ? get_spread_update(instance_spread_levels, [
    				ctx.instanceOptions,
    				{ spawnOptions: ctx.spawnOptions }
    			]) : {};
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
    	subscribe($$self, appState, $$value => { $appState = $$value; $$invalidate('$appState', $appState); });

    	

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
    		init(this, options, instance_1, create_fragment$1, safe_not_equal, ["spawnOptions", "Instance", "ns"]);

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

    /* src/notification/Notification.svelte generated by Svelte v3.6.2 */

    function create_fragment$2(ctx) {
    	var current;

    	var dialogic = new Dialogic({
    		props: {
    		Instance: NotificationInstance,
    		spawnOptions: ctx.notificationSpawnOptions,
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
    			if (changed.NotificationInstance) dialogic_changes.Instance = NotificationInstance;
    			if (changed.notificationSpawnOptions) dialogic_changes.spawnOptions = ctx.notificationSpawnOptions;
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



    function instance$1($$self, $$props, $$invalidate) {
    	

      let { spawn = notification$1.defaultSpawn, id = notification$1.defaultId } = $$props;

      const notificationSpawnOptions = {
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

    	return { spawn, id, notificationSpawnOptions };
    }

    class Notification extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$2, safe_not_equal, ["spawn", "id"]);
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

    const dialog$1 = {
        ...dialog,
        count: getCount$1(dialog.ns)
    };

    /* src/dialog/DialogInstance.svelte generated by Svelte v3.6.2 */

    const file$1 = "src/dialog/DialogInstance.svelte";

    function create_fragment$3(ctx) {
    	var div, t0, t1, t2, button, dispose;

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
    			t0 = text("Dialog\n  ");
    			t1 = text(ctx.title);
    			t2 = space();
    			button = element("button");
    			button.textContent = "hide from instance";
    			add_location(button, file$1, 55, 2, 981);
    			set_attributes(div, div_data);
    			add_location(div, file$1, 48, 0, 884);
    			dispose = listen(button, "click", ctx.hide);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);
    			append(div, t0);
    			append(div, t1);
    			append(div, t2);
    			append(div, button);
    			add_binding_callback(() => ctx.div_binding(div));
    		},

    		p: function update(changed, ctx) {
    			if (changed.title) {
    				set_data(t1, ctx.title);
    			}

    			set_attributes(div, get_spread_update(div_levels, [
    				(changed.R_classNames) && { class: ctx.R_classNames },
    				(changed.elementProps) && ctx.elementProps
    			]));
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}

    			ctx.div_binding(null);
    			dispose();
    		}
    	};
    }

    function instance$2($$self, $$props, $$invalidate) {
    	const dispatch = createEventDispatcher();

      // DOM bindings
      let domElement;

      let { id = undefined, title = "", spawnOptions = undefined, instanceOptions = undefined, className = "", showClass = "pe-dialog--visible" } = $$props;

      const dispatchTransition = (name, hideDelay) =>
        dispatch(name, {
          spawnOptions,
          transitionOptions: {
            showClass,
            domElements: {
              domElement
            },
          },
        });

      const hide = e => {
        dispatchTransition("hide");
      };

      onMount(() => {
        dispatchTransition("mount");
      });

    	const writable_props = ['id', 'title', 'spawnOptions', 'instanceOptions', 'className', 'showClass'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<DialogInstance> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		domElement = $$value;
    		$$invalidate('domElement', domElement);
    	}

    	$$self.$set = $$props => {
    		if ('id' in $$props) $$invalidate('id', id = $$props.id);
    		if ('title' in $$props) $$invalidate('title', title = $$props.title);
    		if ('spawnOptions' in $$props) $$invalidate('spawnOptions', spawnOptions = $$props.spawnOptions);
    		if ('instanceOptions' in $$props) $$invalidate('instanceOptions', instanceOptions = $$props.instanceOptions);
    		if ('className' in $$props) $$invalidate('className', className = $$props.className);
    		if ('showClass' in $$props) $$invalidate('showClass', showClass = $$props.showClass);
    	};

    	let R_classNames, elementProps;

    	$$self.$$.update = ($$dirty = { className: 1, R_classNames: 1 }) => {
    		if ($$dirty.className) { $$invalidate('R_classNames', R_classNames = [
            "pe-dialog",
            className
        	].join(" ")); }
    		if ($$dirty.R_classNames) { $$invalidate('elementProps', elementProps = {
            class: R_classNames,
          }); }
    	};

    	return {
    		domElement,
    		id,
    		title,
    		spawnOptions,
    		instanceOptions,
    		className,
    		showClass,
    		hide,
    		R_classNames,
    		elementProps,
    		div_binding
    	};
    }

    class DialogInstance extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$3, safe_not_equal, ["id", "title", "spawnOptions", "instanceOptions", "className", "showClass"]);
    	}

    	get id() {
    		throw new Error("<DialogInstance>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<DialogInstance>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<DialogInstance>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<DialogInstance>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get spawnOptions() {
    		throw new Error("<DialogInstance>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spawnOptions(value) {
    		throw new Error("<DialogInstance>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get instanceOptions() {
    		throw new Error("<DialogInstance>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set instanceOptions(value) {
    		throw new Error("<DialogInstance>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get className() {
    		throw new Error("<DialogInstance>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set className(value) {
    		throw new Error("<DialogInstance>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get showClass() {
    		throw new Error("<DialogInstance>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set showClass(value) {
    		throw new Error("<DialogInstance>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/dialog/Dialog.svelte generated by Svelte v3.6.2 */

    function create_fragment$4(ctx) {
    	var current;

    	var dialogic = new Dialogic({
    		props: {
    		Instance: DialogInstance,
    		spawnOptions: ctx.dialogSpawnOptions,
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
    			if (changed.DialogInstance) dialogic_changes.Instance = DialogInstance;
    			if (changed.dialogSpawnOptions) dialogic_changes.spawnOptions = ctx.dialogSpawnOptions;
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



    function instance$3($$self, $$props, $$invalidate) {
    	

      let { spawn = dialog$1.defaultSpawn, id = dialog$1.defaultId } = $$props;

      const dialogSpawnOptions = {
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

    	return { spawn, id, dialogSpawnOptions };
    }

    class Dialog extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$4, safe_not_equal, ["spawn", "id"]);
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

    function createCommonjsModule$1(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    var rngBrowser$1 = createCommonjsModule$1(function (module) {
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
    var byteToHex$1 = [];
    for (var i$1 = 0; i$1 < 256; ++i$1) {
      byteToHex$1[i$1] = (i$1 + 0x100).toString(16).substr(1);
    }

    function bytesToUuid$1(buf, offset) {
      var i = offset || 0;
      var bth = byteToHex$1;
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

    var bytesToUuid_1$1 = bytesToUuid$1;

    function v4$1(options, buf, offset) {
      var i = buf && offset || 0;

      if (typeof(options) == 'string') {
        buf = options === 'binary' ? new Array(16) : null;
        options = null;
      }
      options = options || {};

      var rnds = options.random || (options.rng || rngBrowser$1)();

      // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
      rnds[6] = (rnds[6] & 0x0f) | 0x40;
      rnds[8] = (rnds[8] & 0x3f) | 0x80;

      // Copy bytes to buffer, if provided
      if (buf) {
        for (var ii = 0; ii < 16; ++ii) {
          buf[i + ii] = rnds[ii];
        }
      }

      return buf || bytesToUuid_1$1(rnds);
    }

    var v4_1$1 = v4$1;

    /* src/App.svelte generated by Svelte v3.6.2 */

    const file$2 = "src/App.svelte";

    // (78:0) {#if showDialogs}
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
    			add_location(h2, file$2, 79, 0, 2063);
    			add_location(p0, file$2, 81, 0, 2080);
    			add_location(hr0, file$2, 83, 0, 2119);
    			add_location(button0, file$2, 86, 2, 2135);
    			add_location(button1, file$2, 90, 2, 2246);
    			add_location(div0, file$2, 85, 0, 2127);
    			add_location(button2, file$2, 94, 2, 2315);
    			add_location(button3, file$2, 101, 2, 2458);
    			add_location(div1, file$2, 93, 0, 2307);
    			add_location(button4, file$2, 105, 2, 2562);
    			add_location(button5, file$2, 120, 2, 2953);
    			add_location(div2, file$2, 104, 0, 2554);
    			add_location(button6, file$2, 127, 2, 3103);
    			add_location(button7, file$2, 131, 2, 3279);
    			add_location(div3, file$2, 126, 0, 3095);
    			add_location(button8, file$2, 134, 2, 3372);
    			add_location(button9, file$2, 138, 2, 3490);
    			add_location(div4, file$2, 133, 0, 3364);
    			add_location(button10, file$2, 141, 2, 3583);
    			add_location(button11, file$2, 145, 2, 3704);
    			add_location(div5, file$2, 140, 0, 3575);
    			add_location(button12, file$2, 148, 2, 3798);
    			add_location(button13, file$2, 152, 2, 3929);
    			add_location(div6, file$2, 147, 0, 3790);
    			add_location(hr1, file$2, 155, 0, 4010);
    			add_location(p1, file$2, 158, 2, 4026);
    			add_location(div7, file$2, 157, 0, 4018);
    			add_location(p2, file$2, 163, 2, 4070);
    			add_location(div8, file$2, 162, 0, 4062);
    			add_location(hr2, file$2, 167, 0, 4133);
    			add_location(button14, file$2, 170, 2, 4162);
    			add_location(button15, file$2, 174, 2, 4316);
    			add_location(div9, file$2, 169, 0, 4154);
    			add_location(p3, file$2, 178, 2, 4399);
    			add_location(div10, file$2, 177, 0, 4391);

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

    			destroy_component(dialog0, );

    			if (detaching) {
    				detach(t37);
    				detach(div8);
    			}

    			destroy_component(dialog1, );

    			if (detaching) {
    				detach(t40);
    				detach(hr2);
    				detach(t41);
    				detach(div9);
    				detach(t45);
    				detach(div10);
    			}

    			destroy_component(dialog2, );

    			run_all(dispose);
    		}
    	};
    }

    // (189:0) {#if showNotifications}
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
    			add_location(h2, file$2, 190, 0, 4587);
    			add_location(button0, file$2, 193, 2, 4618);
    			add_location(button1, file$2, 206, 2, 4944);
    			add_location(button2, file$2, 211, 2, 5106);
    			add_location(button3, file$2, 216, 2, 5210);
    			add_location(div0, file$2, 192, 0, 4610);
    			add_location(p0, file$2, 224, 2, 5322);
    			add_location(p1, file$2, 225, 2, 5352);
    			add_location(div1, file$2, 223, 0, 5314);
    			add_location(hr, file$2, 229, 0, 5440);

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

    			destroy_component(notification_1, );

    			if (detaching) {
    				detach(t15);
    				detach(hr);
    			}

    			run_all(dispose);
    		}
    	};
    }

    function create_fragment$5(ctx) {
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
    			add_location(button0, file$2, 65, 0, 1590);
    			add_location(button1, file$2, 67, 0, 1703);
    			add_location(button2, file$2, 69, 0, 1798);
    			add_location(button3, file$2, 71, 0, 1876);
    			add_location(hr0, file$2, 73, 0, 1959);
    			add_location(button4, file$2, 75, 0, 1967);
    			add_location(hr1, file$2, 184, 0, 4459);
    			add_location(button5, file$2, 186, 0, 4467);

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
    				transition_out(if_block0, 1, () => {
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
    				transition_out(if_block1, 1, () => {
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

    function instance$4($$self, $$props, $$invalidate) {
    	let $dialogCount, $notificationCount;

    	

      const dialogCount = dialog$1.count; validate_store(dialogCount, 'dialogCount'); subscribe($$self, dialogCount, $$value => { $dialogCount = $$value; $$invalidate('$dialogCount', $dialogCount); });
      const notificationCount = notification$1.count; validate_store(notificationCount, 'notificationCount'); subscribe($$self, notificationCount, $$value => { $notificationCount = $$value; $$invalidate('$notificationCount', $notificationCount); });

      const getRandomNumber = () => Math.round(1000 * Math.random());

      const dialogOneProps = {
        title: "One",
        showDuration: 0.5,
        showDelay: 0.25,
        hideDuration: 0.5,
        hideDelay: .25,
        id: v4_1$1(),
      };
      const dialogTwoProps = {
        title: "Two",
        showDuration: 0.75,
        showDelay: 0,
        hideDuration: 0.75,
        hideDelay: 0,
        id: v4_1$1()
      };
      const dialogFourProps = {
        title: "Four",
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
          }
        },
        id: v4_1$1()
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
    		return dialog$1.show({ title: 'Default ' + getRandomNumber() });
    	}

    	function click_handler_6() {
    		return dialog$1.hide();
    	}

    	function click_handler_7() {
    		return dialog$1.show({
    	      title: 'Timer ' + getRandomNumber(),
    	      timeout: 2000
    	    });
    	}

    	function click_handler_8() {
    		return dialog$1.hide().catch(() => console.log("caught"));
    	}

    	function click_handler_9() {
    		return dialog$1.show(
    	      {
    	        title: 'Promises ' + getRandomNumber(),
    	        didShow: id => console.log("didShow", id),
    	        didHide: id => console.log("didHide", id),
    	        showDuration: 0.5,
    	        showDelay: 0.25,
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
    		return dialog$1.show({ ...dialogOneProps, title: dialogOneProps.title + ' ' + getRandomNumber() }, { id: dialogOneProps.id });
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
    		return dialog$1.show({ title: 'Custom spawn' }, { spawn: 'special' });
    	}

    	function click_handler_18() {
    		return dialog$1.hide({ spawn: 'special' });
    	}

    	function click_handler_19() {
    		return dialog$1.show({ title: 'Queued ' + Math.round(1000 * Math.random()) }, { spawn: 'Q', queued: true });
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
    		return notification$1.show(
    	      {
    	        title: 'N ' + getRandomNumber(),
    	        didShow: id => console.log("didShow", id),
    	        didHide: id => console.log("didHide", id),
    	      },
    	      {
    	        spawn: 'NO'
    	      }
    	    ).then(id => console.log("notification shown", id));
    	}

    	function click_handler_23() {
    		return notification$1.hide(
    	      {
    	        spawn: 'NO'
    	      }
    	    ).then(id => console.log("notification hidden from App", id));
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
    		init(this, options, instance$4, create_fragment$5, safe_not_equal, []);
    	}
    }

    var app = new App({
        target: document.body
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
