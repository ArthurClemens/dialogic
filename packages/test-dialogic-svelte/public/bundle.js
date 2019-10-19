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
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
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

    const globals = (typeof window !== 'undefined' ? window : global);
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
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
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
            ? instance(component, props, (key, ret, value = ret) => {
                if ($$.ctx && not_equal($$.ctx[key], $$.ctx[key] = value)) {
                    if ($$.bound[key])
                        $$.bound[key](value);
                    if (ready)
                        make_dirty(component, key);
                }
                return ret;
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

    /* node_modules/svelte-spa-router/Router.svelte generated by Svelte v3.12.1 */
    const { Error: Error_1, Object: Object_1 } = globals;

    function create_fragment(ctx) {
    	var switch_instance_anchor, current;

    	var switch_value = ctx.component;

    	function switch_props(ctx) {
    		return {
    			props: { params: ctx.componentParams },
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		var switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) switch_instance.$$.fragment.c();
    			switch_instance_anchor = empty();
    		},

    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var switch_instance_changes = {};
    			if (changed.componentParams) switch_instance_changes.params = ctx.componentParams;

    			if (switch_value !== (switch_value = ctx.component)) {
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

    					switch_instance.$$.fragment.c();
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			}

    			else if (switch_value) {
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
    			if (detaching) {
    				detach_dev(switch_instance_anchor);
    			}

    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment.name, type: "component", source: "", ctx });
    	return block;
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
    const hashPosition = window.location.href.indexOf('#/');
    let location = (hashPosition > -1) ? window.location.href.substr(hashPosition + 1) : '/';

    // Check if there's a querystring
    const qsPosition = location.indexOf('?');
    let querystring = '';
    if (qsPosition > -1) {
        querystring = location.substr(qsPosition + 1);
        location = location.substr(0, qsPosition);
    }

    return {location, querystring}
    }

    /**
     * Readable store that returns the current full location (incl. querystring)
     */
    const loc = readable(
    getLocation(),
    // eslint-disable-next-line prefer-arrow-callback
    function start(set) {
        const update = () => {
            set(getLocation());
        };
        window.addEventListener('hashchange', update, false);

        return function stop() {
            window.removeEventListener('hashchange', update, false);
        }
    }
    );

    /**
     * Readable store that returns the current location
     */
    const location = derived(
    loc,
    ($loc) => $loc.location
    );

    /**
     * Readable store that returns the current querystring
     */
    const querystring = derived(
    loc,
    ($loc) => $loc.querystring
    );

    /**
     * Navigates to a new page programmatically.
     *
     * @param {string} location - Path to navigate to (must start with `/`)
     */
    function push(location) {
    if (!location || location.length < 1 || location.charAt(0) != '/') {
        throw Error('Invalid parameter location')
    }

    // Execute this code when the current call stack is complete
    setTimeout(() => {
        window.location.hash = '#' + location;
    }, 0);
    }

    /**
     * Svelte Action that enables a link element (`<a>`) to use our history management.
     *
     * For example:
     *
     * ````html
     * <a href="/books" use:link>View books</a>
     * ````
     *
     * @param {HTMLElement} node - The target node (automatically set by Svelte). Must be an anchor tag (`<a>`) with a href attribute starting in `/`
     */
    function link(node) {
    // Only apply to <a> tags
    if (!node || !node.tagName || node.tagName.toLowerCase() != 'a') {
        throw Error('Action "link" can only be used with <a> tags')
    }

    // Destination must start with '/'
    const href = node.getAttribute('href');
    if (!href || href.length < 1 || href.charAt(0) != '/') {
        throw Error('Invalid value for "href" attribute')
    }

    // onclick event handler
    node.addEventListener('click', (event) => {
        // Disable normal click event
        event.preventDefault();

        // Push link or link children click
        let href;
        let target = event.target;
        while ((href = target.getAttribute('href')) === null) {
            target = target.parentElement;
            if (target === null) {
                throw Error('Could not find corresponding href value')
            }
        }
        push(href);

        return false
    });
    }

    function instance($$self, $$props, $$invalidate) {
    	let $loc;

    	validate_store(loc, 'loc');
    	component_subscribe($$self, loc, $$value => { $loc = $$value; $$invalidate('$loc', $loc); });

    	/**
     * Dictionary of all routes, in the format `'/path': component`.
     *
     * For example:
     * ````js
     * import HomeRoute from './routes/HomeRoute.svelte'
     * import BooksRoute from './routes/BooksRoute.svelte'
     * import NotFoundRoute from './routes/NotFoundRoute.svelte'
     * routes = {
     *     '/': HomeRoute,
     *     '/books': BooksRoute,
     *     '*': NotFoundRoute
     * }
     * ````
     */
    let { routes = {} } = $$props;

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
            // Path must be a regular or expression, or a string starting with '/' or '*'
            if (!path || 
                (typeof path == 'string' && (path.length < 1 || (path.charAt(0) != '/' && path.charAt(0) != '*'))) ||
                (typeof path == 'object' && !(path instanceof RegExp))
            ) {
                throw Error('Invalid value for "path" argument')
            }

            const {pattern, keys} = regexparam(path);

            this.path = path;
            this.component = component;

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
            const matches = this._pattern.exec(path);
            if (matches === null) {
                return null
            }

            // If the input was a regular expression, this._keys would be false, so return matches as is
            if (this._keys === false) {
                return matches
            }

            const out = {};
            let i = 0;
            while (i < this._keys.length) {
                out[this._keys[i]] = matches[++i] || null;
            }
            return out
        }
    }

    // We need an iterable: if it's not a Map, use Object.entries
    const routesIterable = (routes instanceof Map) ? routes : Object.entries(routes);

    // Set up all routes
    const routesList = [];
    for (const [path, route] of routesIterable) {
        routesList.push(new RouteItem(path, route));
    }

    // Props for the component to render
    let component = null;
    let componentParams = {};

    	const writable_props = ['routes'];
    	Object_1.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('routes' in $$props) $$invalidate('routes', routes = $$props.routes);
    	};

    	$$self.$capture_state = () => {
    		return { routes, component, componentParams, $loc };
    	};

    	$$self.$inject_state = $$props => {
    		if ('routes' in $$props) $$invalidate('routes', routes = $$props.routes);
    		if ('component' in $$props) $$invalidate('component', component = $$props.component);
    		if ('componentParams' in $$props) $$invalidate('componentParams', componentParams = $$props.componentParams);
    		if ('$loc' in $$props) loc.set($loc);
    	};

    	$$self.$$.update = ($$dirty = { component: 1, $loc: 1 }) => {
    		if ($$dirty.component || $$dirty.$loc) { {
                // Find a route matching the location
                $$invalidate('component', component = null);
                let i = 0;
                while (!component && i < routesList.length) {
                    const match = routesList[i].match($loc.location);
                    if (match) {
                        $$invalidate('component', component = routesList[i].component);
                        $$invalidate('componentParams', componentParams = match);
                    }
                    i++;
                }
            } }
    	};

    	return { routes, component, componentParams };
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, ["routes"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Router", options, id: create_fragment.name });
    	}

    	get routes() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set routes(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Home.svelte generated by Svelte v3.12.1 */

    const file = "src/Home.svelte";

    function create_fragment$1(ctx) {
    	var div, ul, li0, a0, link_action, t1, li1, a1, link_action_1, t3, li2, a2, link_action_2, t5, li3, a3, link_action_3, t7, li4, a4, link_action_4, t9, li5, a5, link_action_5, t11, li6, a6, link_action_6, t13, li7, a7, link_action_7, t15, li8, a8, link_action_8, t17, li9, a9, link_action_9, t19, li10, a10, link_action_10, t21, li11, a11, link_action_11, t23, li12, a12, link_action_12, t25, li13, a13, link_action_13;

    	const block = {
    		c: function create() {
    			div = element("div");
    			ul = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			a0.textContent = "DialogClassName";
    			t1 = space();
    			li1 = element("li");
    			a1 = element("a");
    			a1.textContent = "DialogClassNameDelay";
    			t3 = space();
    			li2 = element("li");
    			a2 = element("a");
    			a2.textContent = "DialogStyles";
    			t5 = space();
    			li3 = element("li");
    			a3 = element("a");
    			a3.textContent = "DialogIds";
    			t7 = space();
    			li4 = element("li");
    			a4 = element("a");
    			a4.textContent = "DialogCount";
    			t9 = space();
    			li5 = element("li");
    			a5 = element("a");
    			a5.textContent = "DialogHideAll";
    			t11 = space();
    			li6 = element("li");
    			a6 = element("a");
    			a6.textContent = "DialogResetAll";
    			t13 = space();
    			li7 = element("li");
    			a7 = element("a");
    			a7.textContent = "DialogTimeout";
    			t15 = space();
    			li8 = element("li");
    			a8 = element("a");
    			a8.textContent = "DialogQueued";
    			t17 = space();
    			li9 = element("li");
    			a9 = element("a");
    			a9.textContent = "NotificationCount";
    			t19 = space();
    			li10 = element("li");
    			a10 = element("a");
    			a10.textContent = "NotificationPause";
    			t21 = space();
    			li11 = element("li");
    			a11 = element("a");
    			a11.textContent = "NotificationTimeout";
    			t23 = space();
    			li12 = element("li");
    			a12 = element("a");
    			a12.textContent = "LibBulmaDialog";
    			t25 = space();
    			li13 = element("li");
    			a13 = element("a");
    			a13.textContent = "LibMaterialIODialog";
    			attr_dev(a0, "href", "/DialogClassName");
    			add_location(a0, file, 6, 8, 98);
    			add_location(li0, file, 6, 4, 94);
    			attr_dev(a1, "href", "/DialogClassNameDelay");
    			add_location(a1, file, 7, 8, 167);
    			add_location(li1, file, 7, 4, 163);
    			attr_dev(a2, "href", "/DialogStyles");
    			add_location(a2, file, 8, 8, 246);
    			add_location(li2, file, 8, 4, 242);
    			attr_dev(a3, "href", "/DialogIds");
    			add_location(a3, file, 9, 8, 309);
    			add_location(li3, file, 9, 4, 305);
    			attr_dev(a4, "href", "/DialogCount");
    			add_location(a4, file, 10, 8, 366);
    			add_location(li4, file, 10, 4, 362);
    			attr_dev(a5, "href", "/DialogHideAll");
    			add_location(a5, file, 11, 8, 427);
    			add_location(li5, file, 11, 4, 423);
    			attr_dev(a6, "href", "/DialogResetAll");
    			add_location(a6, file, 12, 8, 492);
    			add_location(li6, file, 12, 4, 488);
    			attr_dev(a7, "href", "/DialogTimeout");
    			add_location(a7, file, 13, 8, 559);
    			add_location(li7, file, 13, 4, 555);
    			attr_dev(a8, "href", "/DialogQueued");
    			add_location(a8, file, 14, 8, 624);
    			add_location(li8, file, 14, 4, 620);
    			attr_dev(a9, "href", "/NotificationCount");
    			add_location(a9, file, 15, 8, 687);
    			add_location(li9, file, 15, 4, 683);
    			attr_dev(a10, "href", "/NotificationPause");
    			add_location(a10, file, 16, 8, 760);
    			add_location(li10, file, 16, 4, 756);
    			attr_dev(a11, "href", "/NotificationTimeout");
    			add_location(a11, file, 17, 8, 833);
    			add_location(li11, file, 17, 4, 829);
    			attr_dev(a12, "href", "/LibBulmaDialog");
    			add_location(a12, file, 18, 8, 910);
    			add_location(li12, file, 18, 4, 906);
    			attr_dev(a13, "href", "/LibMaterialIODialog");
    			add_location(a13, file, 19, 8, 977);
    			add_location(li13, file, 19, 4, 973);
    			add_location(ul, file, 5, 2, 85);
    			attr_dev(div, "class", "menu");
    			add_location(div, file, 4, 0, 64);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a0);
    			link_action = link.call(null, a0) || {};
    			append_dev(ul, t1);
    			append_dev(ul, li1);
    			append_dev(li1, a1);
    			link_action_1 = link.call(null, a1) || {};
    			append_dev(ul, t3);
    			append_dev(ul, li2);
    			append_dev(li2, a2);
    			link_action_2 = link.call(null, a2) || {};
    			append_dev(ul, t5);
    			append_dev(ul, li3);
    			append_dev(li3, a3);
    			link_action_3 = link.call(null, a3) || {};
    			append_dev(ul, t7);
    			append_dev(ul, li4);
    			append_dev(li4, a4);
    			link_action_4 = link.call(null, a4) || {};
    			append_dev(ul, t9);
    			append_dev(ul, li5);
    			append_dev(li5, a5);
    			link_action_5 = link.call(null, a5) || {};
    			append_dev(ul, t11);
    			append_dev(ul, li6);
    			append_dev(li6, a6);
    			link_action_6 = link.call(null, a6) || {};
    			append_dev(ul, t13);
    			append_dev(ul, li7);
    			append_dev(li7, a7);
    			link_action_7 = link.call(null, a7) || {};
    			append_dev(ul, t15);
    			append_dev(ul, li8);
    			append_dev(li8, a8);
    			link_action_8 = link.call(null, a8) || {};
    			append_dev(ul, t17);
    			append_dev(ul, li9);
    			append_dev(li9, a9);
    			link_action_9 = link.call(null, a9) || {};
    			append_dev(ul, t19);
    			append_dev(ul, li10);
    			append_dev(li10, a10);
    			link_action_10 = link.call(null, a10) || {};
    			append_dev(ul, t21);
    			append_dev(ul, li11);
    			append_dev(li11, a11);
    			link_action_11 = link.call(null, a11) || {};
    			append_dev(ul, t23);
    			append_dev(ul, li12);
    			append_dev(li12, a12);
    			link_action_12 = link.call(null, a12) || {};
    			append_dev(ul, t25);
    			append_dev(ul, li13);
    			append_dev(li13, a13);
    			link_action_13 = link.call(null, a13) || {};
    		},

    		p: noop,
    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div);
    			}

    			if (link_action && typeof link_action.destroy === 'function') link_action.destroy();
    			if (link_action_1 && typeof link_action_1.destroy === 'function') link_action_1.destroy();
    			if (link_action_2 && typeof link_action_2.destroy === 'function') link_action_2.destroy();
    			if (link_action_3 && typeof link_action_3.destroy === 'function') link_action_3.destroy();
    			if (link_action_4 && typeof link_action_4.destroy === 'function') link_action_4.destroy();
    			if (link_action_5 && typeof link_action_5.destroy === 'function') link_action_5.destroy();
    			if (link_action_6 && typeof link_action_6.destroy === 'function') link_action_6.destroy();
    			if (link_action_7 && typeof link_action_7.destroy === 'function') link_action_7.destroy();
    			if (link_action_8 && typeof link_action_8.destroy === 'function') link_action_8.destroy();
    			if (link_action_9 && typeof link_action_9.destroy === 'function') link_action_9.destroy();
    			if (link_action_10 && typeof link_action_10.destroy === 'function') link_action_10.destroy();
    			if (link_action_11 && typeof link_action_11.destroy === 'function') link_action_11.destroy();
    			if (link_action_12 && typeof link_action_12.destroy === 'function') link_action_12.destroy();
    			if (link_action_13 && typeof link_action_13.destroy === 'function') link_action_13.destroy();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$1.name, type: "component", source: "", ctx });
    	return block;
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$1, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Home", options, id: create_fragment$1.name });
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
            const domElement = existingItem.dialogicOptions.domElement;
            const item = {
                ...maybeExistingItem.just,
                dialogicOptions: {
                    ...existingItem,
                    ...dialogicOptions,
                    domElement
                },
                passThroughOptions,
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
     * `dialogicOptions` may contain specific transition options. This comes in handy when all items should hide in the same manner.
     * */
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
    //# sourceMappingURL=dialogic.mjs.map

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
    	() => getTimerProperty("isPaused")(ns)(defaultDialogicOptions)(identityOptions)
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

    /* Users/arthur/code/Github Projects/dialogic/master/packages/dialogic-svelte/src/Instance.svelte generated by Svelte v3.12.1 */

    const file$1 = "Users/arthur/code/Github Projects/dialogic/master/packages/dialogic-svelte/src/Instance.svelte";

    function create_fragment$2(ctx) {
    	var div, current;

    	var switch_instance_spread_levels = [
    		{ show: ctx.show },
    		{ hide: ctx.hide },
    		ctx.passThroughOptions
    	];

    	var switch_value = ctx.dialogicOptions.component;

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

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (switch_instance) switch_instance.$$.fragment.c();
    			attr_dev(div, "class", ctx.className);
    			add_location(div, file$1, 34, 0, 616);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (switch_instance) {
    				mount_component(switch_instance, div, null);
    			}

    			ctx.div_binding(div);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var switch_instance_changes = (changed.show || changed.hide || changed.passThroughOptions) ? get_spread_update(switch_instance_spread_levels, [
    									(changed.show) && { show: ctx.show },
    			(changed.hide) && { hide: ctx.hide },
    			(changed.passThroughOptions) && get_spread_object(ctx.passThroughOptions)
    								]) : {};

    			if (switch_value !== (switch_value = ctx.dialogicOptions.component)) {
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
    				detach_dev(div);
    			}

    			if (switch_instance) destroy_component(switch_instance);
    			ctx.div_binding(null);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$2.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	const dispatch = createEventDispatcher();

      // DOM bindings
      let domElement;

      let { identityOptions, passThroughOptions, dialogicOptions } = $$props;

      const className = dialogicOptions ? dialogicOptions.className : '';

      const dispatchTransition = (name) =>
        dispatch(name, {
          identityOptions,
          domElement
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

    	const writable_props = ['identityOptions', 'passThroughOptions', 'dialogicOptions'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Instance> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			$$invalidate('domElement', domElement = $$value);
    		});
    	}

    	$$self.$set = $$props => {
    		if ('identityOptions' in $$props) $$invalidate('identityOptions', identityOptions = $$props.identityOptions);
    		if ('passThroughOptions' in $$props) $$invalidate('passThroughOptions', passThroughOptions = $$props.passThroughOptions);
    		if ('dialogicOptions' in $$props) $$invalidate('dialogicOptions', dialogicOptions = $$props.dialogicOptions);
    	};

    	$$self.$capture_state = () => {
    		return { domElement, identityOptions, passThroughOptions, dialogicOptions };
    	};

    	$$self.$inject_state = $$props => {
    		if ('domElement' in $$props) $$invalidate('domElement', domElement = $$props.domElement);
    		if ('identityOptions' in $$props) $$invalidate('identityOptions', identityOptions = $$props.identityOptions);
    		if ('passThroughOptions' in $$props) $$invalidate('passThroughOptions', passThroughOptions = $$props.passThroughOptions);
    		if ('dialogicOptions' in $$props) $$invalidate('dialogicOptions', dialogicOptions = $$props.dialogicOptions);
    	};

    	return {
    		domElement,
    		identityOptions,
    		passThroughOptions,
    		dialogicOptions,
    		className,
    		show,
    		hide,
    		div_binding
    	};
    }

    class Instance extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$2, safe_not_equal, ["identityOptions", "passThroughOptions", "dialogicOptions"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Instance", options, id: create_fragment$2.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.identityOptions === undefined && !('identityOptions' in props)) {
    			console.warn("<Instance> was created without expected prop 'identityOptions'");
    		}
    		if (ctx.passThroughOptions === undefined && !('passThroughOptions' in props)) {
    			console.warn("<Instance> was created without expected prop 'passThroughOptions'");
    		}
    		if (ctx.dialogicOptions === undefined && !('dialogicOptions' in props)) {
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

    /* Users/arthur/code/Github Projects/dialogic/master/packages/dialogic-svelte/src/Wrapper.svelte generated by Svelte v3.12.1 */

    function get_each_context(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.identityOptions = list[i].identityOptions;
    	child_ctx.dialogicOptions = list[i].dialogicOptions;
    	child_ctx.passThroughOptions = list[i].passThroughOptions;
    	child_ctx.key = list[i].key;
    	child_ctx.index = i;
    	return child_ctx;
    }

    // (17:0) {#each filterCandidates(ns, $appState.store, identityOptions) as { identityOptions, dialogicOptions, passThroughOptions, key }
    function create_each_block(key_1, ctx) {
    	var first, current;

    	var instance = new Instance({
    		props: {
    		identityOptions: ctx.identityOptions,
    		dialogicOptions: ctx.dialogicOptions,
    		passThroughOptions: ctx.passThroughOptions
    	},
    		$$inline: true
    	});
    	instance.$on("mount", ctx.nsOnInstanceMounted);
    	instance.$on("show", ctx.nsOnShowInstance);
    	instance.$on("hide", ctx.nsOnHideInstance);

    	const block = {
    		key: key_1,

    		first: null,

    		c: function create() {
    			first = empty();
    			instance.$$.fragment.c();
    			this.first = first;
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(instance, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var instance_changes = {};
    			if (changed.ns || changed.$appState || changed.identityOptions) instance_changes.identityOptions = ctx.identityOptions;
    			if (changed.ns || changed.$appState || changed.identityOptions) instance_changes.dialogicOptions = ctx.dialogicOptions;
    			if (changed.ns || changed.$appState || changed.identityOptions) instance_changes.passThroughOptions = ctx.passThroughOptions;
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
    				detach_dev(first);
    			}

    			destroy_component(instance, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_each_block.name, type: "each", source: "(17:0) {#each filterCandidates(ns, $appState.store, identityOptions) as { identityOptions, dialogicOptions, passThroughOptions, key }", ctx });
    	return block;
    }

    function create_fragment$3(ctx) {
    	var each_blocks = [], each_1_lookup = new Map(), each_1_anchor, current;

    	let each_value = filterCandidates(ctx.ns, ctx.$appState.store, ctx.identityOptions);

    	const get_key = ctx => ctx.key;

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

    		p: function update(changed, ctx) {
    			const each_value = filterCandidates(ctx.ns, ctx.$appState.store, ctx.identityOptions);

    			group_outros();
    			each_blocks = update_keyed_each(each_blocks, changed, get_key, 1, ctx, each_value, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block, each_1_anchor, get_each_context);
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

    			if (detaching) {
    				detach_dev(each_1_anchor);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$3.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance_1($$self, $$props, $$invalidate) {
    	let $appState;

    	validate_store(appState, 'appState');
    	component_subscribe($$self, appState, $$value => { $appState = $$value; $$invalidate('$appState', $appState); });

    	

      let { identityOptions, ns } = $$props;

      const nsOnInstanceMounted = onInstanceMounted(ns);
      const nsOnShowInstance = onShowInstance(ns);
      const nsOnHideInstance = onHideInstance(ns);

    	const writable_props = ['identityOptions', 'ns'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Wrapper> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('identityOptions' in $$props) $$invalidate('identityOptions', identityOptions = $$props.identityOptions);
    		if ('ns' in $$props) $$invalidate('ns', ns = $$props.ns);
    	};

    	$$self.$capture_state = () => {
    		return { identityOptions, ns, $appState };
    	};

    	$$self.$inject_state = $$props => {
    		if ('identityOptions' in $$props) $$invalidate('identityOptions', identityOptions = $$props.identityOptions);
    		if ('ns' in $$props) $$invalidate('ns', ns = $$props.ns);
    		if ('$appState' in $$props) appState.set($appState);
    	};

    	return {
    		identityOptions,
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
    		init(this, options, instance_1, create_fragment$3, safe_not_equal, ["identityOptions", "ns"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Wrapper", options, id: create_fragment$3.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.identityOptions === undefined && !('identityOptions' in props)) {
    			console.warn("<Wrapper> was created without expected prop 'identityOptions'");
    		}
    		if (ctx.ns === undefined && !('ns' in props)) {
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

    /* Users/arthur/code/Github Projects/dialogic/master/packages/dialogic-svelte/src/Dialogical.svelte generated by Svelte v3.12.1 */

    function create_fragment$4(ctx) {
    	var current;

    	var wrapper = new Wrapper({
    		props: {
    		identityOptions: ctx.identityOptions,
    		ns: ctx.ns
    	},
    		$$inline: true
    	});

    	const block = {
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
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$4.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	

      let { type, ns = type.ns, spawn = undefined, id = undefined, onMount: onMount$1 = undefined } = $$props;

      const identityOptions = {
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

    	$$self.$capture_state = () => {
    		return { type, ns, spawn, id, onMount: onMount$1 };
    	};

    	$$self.$inject_state = $$props => {
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
    		identityOptions
    	};
    }

    class Dialogical extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$4, safe_not_equal, ["type", "ns", "spawn", "id", "onMount"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Dialogical", options, id: create_fragment$4.name });

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

    /* Users/arthur/code/Github Projects/dialogic/master/packages/dialogic-svelte/src/Dialog.svelte generated by Svelte v3.12.1 */

    function create_fragment$5(ctx) {
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

    	const block = {
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
    									(changed.$$props) && get_spread_object(ctx.$$props),
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
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$5.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	$$self.$set = $$new_props => {
    		$$invalidate('$$props', $$props = assign(assign({}, $$props), $$new_props));
    	};

    	$$self.$capture_state = () => {
    		return {  };
    	};

    	$$self.$inject_state = $$new_props => {
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
    		init(this, options, instance$3, create_fragment$5, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Dialog", options, id: create_fragment$5.name });
    	}
    }

    /* Users/arthur/code/Github Projects/dialogic/master/packages/dialogic-svelte/src/Notification.svelte generated by Svelte v3.12.1 */

    function create_fragment$6(ctx) {
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

    	const block = {
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
    									(changed.$$props) && get_spread_object(ctx.$$props),
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
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$6.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	$$self.$set = $$new_props => {
    		$$invalidate('$$props', $$props = assign(assign({}, $$props), $$new_props));
    	};

    	$$self.$capture_state = () => {
    		return {  };
    	};

    	$$self.$inject_state = $$new_props => {
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
    		init(this, options, instance$4, create_fragment$6, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Notification", options, id: create_fragment$6.name });
    	}
    }

    /* src/cypress-tests/content/Default.svelte generated by Svelte v3.12.1 */

    const file$2 = "src/cypress-tests/content/Default.svelte";

    function create_fragment$7(ctx) {
    	var div, h2, t0_value = ctx.$$props.title + "", t0, t1, button, div_class_value, div_data_test_id_value, dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h2 = element("h2");
    			t0 = text(t0_value);
    			t1 = space();
    			button = element("button");
    			button.textContent = "Hide from component";
    			add_location(h2, file$2, 4, 2, 123);
    			attr_dev(button, "class", "button");
    			attr_dev(button, "data-test-id", "button-hide-content");
    			add_location(button, file$2, 5, 2, 150);
    			attr_dev(div, "class", div_class_value = ctx.$$props.className);
    			attr_dev(div, "data-test-id", div_data_test_id_value = `content-default${ctx.$$props.contentId ? `-${ctx.$$props.contentId}` : ''}`);
    			add_location(div, file$2, 0, 0, 0);
    			dispose = listen_dev(button, "click", ctx.$$props.hide);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h2);
    			append_dev(h2, t0);
    			append_dev(div, t1);
    			append_dev(div, button);
    		},

    		p: function update(changed, ctx) {
    			if ((changed.$$props) && t0_value !== (t0_value = ctx.$$props.title + "")) {
    				set_data_dev(t0, t0_value);
    			}

    			if ((changed.$$props) && div_class_value !== (div_class_value = ctx.$$props.className)) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if ((changed.$$props) && div_data_test_id_value !== (div_data_test_id_value = `content-default${ctx.$$props.contentId ? `-${ctx.$$props.contentId}` : ''}`)) {
    				attr_dev(div, "data-test-id", div_data_test_id_value);
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div);
    			}

    			dispose();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$7.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	$$self.$set = $$new_props => {
    		$$invalidate('$$props', $$props = assign(assign({}, $$props), $$new_props));
    	};

    	$$self.$capture_state = () => {
    		return {  };
    	};

    	$$self.$inject_state = $$new_props => {
    		$$invalidate('$$props', $$props = assign(assign({}, $$props), $$new_props));
    	};

    	return {
    		$$props,
    		$$props: $$props = exclude_internal_props($$props)
    	};
    }

    class Default extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$7, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Default", options, id: create_fragment$7.name });
    	}
    }

    /* src/cypress-tests/Buttons.svelte generated by Svelte v3.12.1 */

    const file$3 = "src/cypress-tests/Buttons.svelte";

    // (12:0) {#if showFn}
    function create_if_block_1(ctx) {
    	var button, t_value = `Show ${ctx.genName}` + "", t, dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(t_value);
    			attr_dev(button, "class", "button primary");
    			attr_dev(button, "data-test-id", `button-show-${ctx.genName}`);
    			add_location(button, file$3, 12, 2, 255);
    			dispose = listen_dev(button, "click", ctx.showFn);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);
    		},

    		p: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(button);
    			}

    			dispose();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_1.name, type: "if", source: "(12:0) {#if showFn}", ctx });
    	return block;
    }

    // (21:0) {#if hideFn}
    function create_if_block(ctx) {
    	var button, t_value = `Hide ${ctx.genName}` + "", t, dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(t_value);
    			attr_dev(button, "class", "button");
    			attr_dev(button, "data-test-id", `button-hide-${ctx.genName}`);
    			add_location(button, file$3, 21, 2, 417);
    			dispose = listen_dev(button, "click", ctx.hideFn);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);
    		},

    		p: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(button);
    			}

    			dispose();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block.name, type: "if", source: "(21:0) {#if hideFn}", ctx });
    	return block;
    }

    function create_fragment$8(ctx) {
    	var div, t;

    	var if_block0 = (ctx.showFn) && create_if_block_1(ctx);

    	var if_block1 = (ctx.hideFn) && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			attr_dev(div, "class", "buttons");
    			add_location(div, file$3, 10, 0, 218);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t);
    			if (if_block1) if_block1.m(div, null);
    		},

    		p: function update(changed, ctx) {
    			if (ctx.showFn) {
    				if (if_block0) {
    					if_block0.p(changed, ctx);
    				} else {
    					if_block0 = create_if_block_1(ctx);
    					if_block0.c();
    					if_block0.m(div, t);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (ctx.hideFn) {
    				if (if_block1) {
    					if_block1.p(changed, ctx);
    				} else {
    					if_block1 = create_if_block(ctx);
    					if_block1.c();
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div);
    			}

    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$8.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { showFn, hideFn, id = "", spawn = "", name = "" } = $$props;

    const genName = name || `${id ? `id${id}` : ''}${spawn ? `spawn${spawn}` : ''}` || "default";

    	const writable_props = ['showFn', 'hideFn', 'id', 'spawn', 'name'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Buttons> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('showFn' in $$props) $$invalidate('showFn', showFn = $$props.showFn);
    		if ('hideFn' in $$props) $$invalidate('hideFn', hideFn = $$props.hideFn);
    		if ('id' in $$props) $$invalidate('id', id = $$props.id);
    		if ('spawn' in $$props) $$invalidate('spawn', spawn = $$props.spawn);
    		if ('name' in $$props) $$invalidate('name', name = $$props.name);
    	};

    	$$self.$capture_state = () => {
    		return { showFn, hideFn, id, spawn, name };
    	};

    	$$self.$inject_state = $$props => {
    		if ('showFn' in $$props) $$invalidate('showFn', showFn = $$props.showFn);
    		if ('hideFn' in $$props) $$invalidate('hideFn', hideFn = $$props.hideFn);
    		if ('id' in $$props) $$invalidate('id', id = $$props.id);
    		if ('spawn' in $$props) $$invalidate('spawn', spawn = $$props.spawn);
    		if ('name' in $$props) $$invalidate('name', name = $$props.name);
    	};

    	return { showFn, hideFn, id, spawn, name, genName };
    }

    class Buttons extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$8, safe_not_equal, ["showFn", "hideFn", "id", "spawn", "name"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Buttons", options, id: create_fragment$8.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.showFn === undefined && !('showFn' in props)) {
    			console.warn("<Buttons> was created without expected prop 'showFn'");
    		}
    		if (ctx.hideFn === undefined && !('hideFn' in props)) {
    			console.warn("<Buttons> was created without expected prop 'hideFn'");
    		}
    	}

    	get showFn() {
    		throw new Error("<Buttons>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set showFn(value) {
    		throw new Error("<Buttons>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hideFn() {
    		throw new Error("<Buttons>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hideFn(value) {
    		throw new Error("<Buttons>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<Buttons>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Buttons>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get spawn() {
    		throw new Error("<Buttons>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spawn(value) {
    		throw new Error("<Buttons>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<Buttons>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Buttons>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const getRandomId = () => Math.round(1000 * Math.random()).toString();

    const createFns = ({ instance, component, className, title, id, spawn, styles, timeout, queued }) => {
        const contentId = `${id ? `id${id}` : ''}${spawn ? `spawn${spawn}` : ''}`;
        const props = {
            dialogic: {
                component: component,
                className,
                styles,
                id,
                spawn,
                ...(spawn !== undefined
                    ? { spawn }
                    : undefined),
                ...(timeout !== undefined
                    ? { timeout }
                    : undefined),
                ...(queued !== undefined
                    ? { queued }
                    : undefined),
            },
            className: "instance-content",
            id: getRandomId(),
            contentId
        };
        const showFn = () => instance.show({
            ...props,
            title: `${title} ${getRandomId()}`,
        });
        const hideFn = () => instance.hide({
            ...props,
            title: `${title} ${getRandomId()} hiding`,
        });
        return {
            showFn,
            hideFn
        };
    };

    /* src/cypress-tests/DialogClassName.svelte generated by Svelte v3.12.1 */

    const file$4 = "src/cypress-tests/DialogClassName.svelte";

    function create_fragment$9(ctx) {
    	var div1, t, div0, current;

    	var buttons_spread_levels = [
    		ctx.fns
    	];

    	let buttons_props = {};
    	for (var i = 0; i < buttons_spread_levels.length; i += 1) {
    		buttons_props = assign(buttons_props, buttons_spread_levels[i]);
    	}
    	var buttons = new Buttons({ props: buttons_props, $$inline: true });

    	var dialog_1 = new Dialog({ $$inline: true });

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			buttons.$$.fragment.c();
    			t = space();
    			div0 = element("div");
    			dialog_1.$$.fragment.c();
    			attr_dev(div0, "class", "spawn default-spawn");
    			add_location(div0, file$4, 11, 2, 369);
    			attr_dev(div1, "class", "test");
    			add_location(div1, file$4, 9, 0, 325);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			mount_component(buttons, div1, null);
    			append_dev(div1, t);
    			append_dev(div1, div0);
    			mount_component(dialog_1, div0, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var buttons_changes = (changed.fns) ? get_spread_update(buttons_spread_levels, [
    									get_spread_object(ctx.fns)
    								]) : {};
    			buttons.$set(buttons_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(buttons.$$.fragment, local);

    			transition_in(dialog_1.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(buttons.$$.fragment, local);
    			transition_out(dialog_1.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div1);
    			}

    			destroy_component(buttons);

    			destroy_component(dialog_1);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$9.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$7($$self) {
    	

      const fns = createFns({ instance: dialog$1, component: Default, className: "dialog", title: "DialogClassName" });

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {};

    	return { fns };
    }

    class DialogClassName extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$9, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "DialogClassName", options, id: create_fragment$9.name });
    	}
    }

    /* src/cypress-tests/DialogClassNameDelay.svelte generated by Svelte v3.12.1 */

    const file$5 = "src/cypress-tests/DialogClassNameDelay.svelte";

    function create_fragment$a(ctx) {
    	var div1, t, div0, current;

    	var buttons_spread_levels = [
    		ctx.fns
    	];

    	let buttons_props = {};
    	for (var i = 0; i < buttons_spread_levels.length; i += 1) {
    		buttons_props = assign(buttons_props, buttons_spread_levels[i]);
    	}
    	var buttons = new Buttons({ props: buttons_props, $$inline: true });

    	var dialog_1 = new Dialog({ $$inline: true });

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			buttons.$$.fragment.c();
    			t = space();
    			div0 = element("div");
    			dialog_1.$$.fragment.c();
    			attr_dev(div0, "class", "spawn default-spawn");
    			add_location(div0, file$5, 11, 2, 376);
    			attr_dev(div1, "class", "test");
    			add_location(div1, file$5, 9, 0, 332);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			mount_component(buttons, div1, null);
    			append_dev(div1, t);
    			append_dev(div1, div0);
    			mount_component(dialog_1, div0, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var buttons_changes = (changed.fns) ? get_spread_update(buttons_spread_levels, [
    									get_spread_object(ctx.fns)
    								]) : {};
    			buttons.$set(buttons_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(buttons.$$.fragment, local);

    			transition_in(dialog_1.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(buttons.$$.fragment, local);
    			transition_out(dialog_1.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div1);
    			}

    			destroy_component(buttons);

    			destroy_component(dialog_1);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$a.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$8($$self) {
    	

      const fns = createFns({ instance: dialog$1, component: Default, className: "dialog-delay", title: "DialogClassDelay" });

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {};

    	return { fns };
    }

    class DialogClassNameDelay extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$a, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "DialogClassNameDelay", options, id: create_fragment$a.name });
    	}
    }

    /* src/cypress-tests/DialogStyles.svelte generated by Svelte v3.12.1 */

    const file$6 = "src/cypress-tests/DialogStyles.svelte";

    function create_fragment$b(ctx) {
    	var div1, t0, t1, div0, current;

    	var buttons0_spread_levels = [
    		ctx.fns1
    	];

    	let buttons0_props = {};
    	for (var i = 0; i < buttons0_spread_levels.length; i += 1) {
    		buttons0_props = assign(buttons0_props, buttons0_spread_levels[i]);
    	}
    	var buttons0 = new Buttons({ props: buttons0_props, $$inline: true });

    	var buttons1_spread_levels = [
    		ctx.fns2,
    		{ name: "combi" }
    	];

    	let buttons1_props = {};
    	for (var i = 0; i < buttons1_spread_levels.length; i += 1) {
    		buttons1_props = assign(buttons1_props, buttons1_spread_levels[i]);
    	}
    	var buttons1 = new Buttons({ props: buttons1_props, $$inline: true });

    	var dialog_1 = new Dialog({ $$inline: true });

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			buttons0.$$.fragment.c();
    			t0 = space();
    			buttons1.$$.fragment.c();
    			t1 = space();
    			div0 = element("div");
    			dialog_1.$$.fragment.c();
    			attr_dev(div0, "class", "spawn default-spawn");
    			add_location(div0, file$6, 56, 2, 1447);
    			attr_dev(div1, "class", "test");
    			add_location(div1, file$6, 53, 0, 1365);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			mount_component(buttons0, div1, null);
    			append_dev(div1, t0);
    			mount_component(buttons1, div1, null);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			mount_component(dialog_1, div0, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var buttons0_changes = (changed.fns1) ? get_spread_update(buttons0_spread_levels, [
    									get_spread_object(ctx.fns1)
    								]) : {};
    			buttons0.$set(buttons0_changes);

    			var buttons1_changes = (changed.fns2) ? get_spread_update(buttons1_spread_levels, [
    									get_spread_object(ctx.fns2),
    			buttons1_spread_levels[1]
    								]) : {};
    			buttons1.$set(buttons1_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(buttons0.$$.fragment, local);

    			transition_in(buttons1.$$.fragment, local);

    			transition_in(dialog_1.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(buttons0.$$.fragment, local);
    			transition_out(buttons1.$$.fragment, local);
    			transition_out(dialog_1.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div1);
    			}

    			destroy_component(buttons0);

    			destroy_component(buttons1);

    			destroy_component(dialog_1);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$b.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$9($$self) {
    	

      const fns1 = createFns({
        instance: dialog$1,
        component: Default,
        title: "DialogStyles",
        styles: (domElement) => {
          const height = domElement.getBoundingClientRect().height;
          return {
            default: {
              transition: "all 300ms ease-in-out",
            },
            showStart: {
              opacity: "0",
              transform: `translate3d(0, ${height}px, 0)`,
            },
            showEnd: {
              opacity: "1",
              transform: "translate3d(0, 0px,  0)",
            },
            hideEnd: {
              transitionDuration: "450ms",
              transform: `translate3d(0, ${height}px, 0)`,
              opacity: "0",
            },
          }
        },
      });
      const fns2 = createFns({
        instance: dialog$1,
        component: Default,
        title: "DialogStyles combi",
        className: "dialog",
        styles: (domElement) => {
          const height = domElement.getBoundingClientRect().height;
          return {
            default: {
              transition: "all 300ms ease-in-out",
            },
            hideEnd: {
              transitionDuration: "450ms",
              transform: `translate3d(0, ${height}px, 0)`,
              opacity: "0",
            },
          }
        },
      });

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {};

    	return { fns1, fns2 };
    }

    class DialogStyles extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$b, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "DialogStyles", options, id: create_fragment$b.name });
    	}
    }

    /* src/cypress-tests/DialogIds.svelte generated by Svelte v3.12.1 */

    const file$7 = "src/cypress-tests/DialogIds.svelte";

    function create_fragment$c(ctx) {
    	var div1, t0, t1, t2, div0, current;

    	var buttons0_spread_levels = [
    		ctx.fns1
    	];

    	let buttons0_props = {};
    	for (var i = 0; i < buttons0_spread_levels.length; i += 1) {
    		buttons0_props = assign(buttons0_props, buttons0_spread_levels[i]);
    	}
    	var buttons0 = new Buttons({ props: buttons0_props, $$inline: true });

    	var buttons1_spread_levels = [
    		ctx.fns2,
    		{ id: "1" }
    	];

    	let buttons1_props = {};
    	for (var i = 0; i < buttons1_spread_levels.length; i += 1) {
    		buttons1_props = assign(buttons1_props, buttons1_spread_levels[i]);
    	}
    	var buttons1 = new Buttons({ props: buttons1_props, $$inline: true });

    	var buttons2_spread_levels = [
    		ctx.fns3,
    		{ id: "2" }
    	];

    	let buttons2_props = {};
    	for (var i = 0; i < buttons2_spread_levels.length; i += 1) {
    		buttons2_props = assign(buttons2_props, buttons2_spread_levels[i]);
    	}
    	var buttons2 = new Buttons({ props: buttons2_props, $$inline: true });

    	var dialog_1 = new Dialog({ $$inline: true });

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			buttons0.$$.fragment.c();
    			t0 = space();
    			buttons1.$$.fragment.c();
    			t1 = space();
    			buttons2.$$.fragment.c();
    			t2 = space();
    			div0 = element("div");
    			dialog_1.$$.fragment.c();
    			attr_dev(div0, "class", "spawn default-spawn");
    			add_location(div0, file$7, 16, 2, 696);
    			attr_dev(div1, "class", "test");
    			add_location(div1, file$7, 12, 0, 589);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			mount_component(buttons0, div1, null);
    			append_dev(div1, t0);
    			mount_component(buttons1, div1, null);
    			append_dev(div1, t1);
    			mount_component(buttons2, div1, null);
    			append_dev(div1, t2);
    			append_dev(div1, div0);
    			mount_component(dialog_1, div0, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var buttons0_changes = (changed.fns1) ? get_spread_update(buttons0_spread_levels, [
    									get_spread_object(ctx.fns1)
    								]) : {};
    			buttons0.$set(buttons0_changes);

    			var buttons1_changes = (changed.fns2) ? get_spread_update(buttons1_spread_levels, [
    									get_spread_object(ctx.fns2),
    			buttons1_spread_levels[1]
    								]) : {};
    			buttons1.$set(buttons1_changes);

    			var buttons2_changes = (changed.fns3) ? get_spread_update(buttons2_spread_levels, [
    									get_spread_object(ctx.fns3),
    			buttons2_spread_levels[1]
    								]) : {};
    			buttons2.$set(buttons2_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(buttons0.$$.fragment, local);

    			transition_in(buttons1.$$.fragment, local);

    			transition_in(buttons2.$$.fragment, local);

    			transition_in(dialog_1.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(buttons0.$$.fragment, local);
    			transition_out(buttons1.$$.fragment, local);
    			transition_out(buttons2.$$.fragment, local);
    			transition_out(dialog_1.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div1);
    			}

    			destroy_component(buttons0);

    			destroy_component(buttons1);

    			destroy_component(buttons2);

    			destroy_component(dialog_1);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$c.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$a($$self) {
    	

      dialog$1.resetAll();
      const fns1 = createFns({ instance: dialog$1, component: Default, className: "dialog", title: "DialogIds default" });
      const fns2 = createFns({ instance: dialog$1, component: Default, className: "dialog", id: "1", title: "DialogIds 1" });
      const fns3 = createFns({ instance: dialog$1, component: Default, className: "dialog", id: "2", title: "DialogIds 2" });

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {};

    	return { fns1, fns2, fns3 };
    }

    class DialogIds extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$c, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "DialogIds", options, id: create_fragment$c.name });
    	}
    }

    /* src/cypress-tests/DialogExists.svelte generated by Svelte v3.12.1 */

    const file$8 = "src/cypress-tests/DialogExists.svelte";

    function create_fragment$d(ctx) {
    	var div7, div0, t0_value = `Exists any: ${ctx.$dialogExists}` + "", t0, t1, div1, t2_value = `Exists id: ${ctx.$dialogExistsId1}` + "", t2, t3, div2, t4_value = `Exists spawn: ${ctx.$dialogExistsSpawn1}` + "", t4, t5, div3, t6_value = `Exists spawn, id: ${ctx.$dialogExistsSpawn1Id1}` + "", t6, t7, div4, t8, t9, t10, t11, div5, t12, div6, current;

    	var buttons0_spread_levels = [
    		ctx.fns1
    	];

    	let buttons0_props = {};
    	for (var i = 0; i < buttons0_spread_levels.length; i += 1) {
    		buttons0_props = assign(buttons0_props, buttons0_spread_levels[i]);
    	}
    	var buttons0 = new Buttons({ props: buttons0_props, $$inline: true });

    	var buttons1_spread_levels = [
    		ctx.fns2,
    		{ id: "1" }
    	];

    	let buttons1_props = {};
    	for (var i = 0; i < buttons1_spread_levels.length; i += 1) {
    		buttons1_props = assign(buttons1_props, buttons1_spread_levels[i]);
    	}
    	var buttons1 = new Buttons({ props: buttons1_props, $$inline: true });

    	var buttons2_spread_levels = [
    		ctx.fns3,
    		{ spawn: "1" }
    	];

    	let buttons2_props = {};
    	for (var i = 0; i < buttons2_spread_levels.length; i += 1) {
    		buttons2_props = assign(buttons2_props, buttons2_spread_levels[i]);
    	}
    	var buttons2 = new Buttons({ props: buttons2_props, $$inline: true });

    	var buttons3_spread_levels = [
    		ctx.fns4,
    		{ spawn: "1" },
    		{ id: "1" }
    	];

    	let buttons3_props = {};
    	for (var i = 0; i < buttons3_spread_levels.length; i += 1) {
    		buttons3_props = assign(buttons3_props, buttons3_spread_levels[i]);
    	}
    	var buttons3 = new Buttons({ props: buttons3_props, $$inline: true });

    	var dialog0 = new Dialog({ $$inline: true });

    	var dialog1 = new Dialog({ props: { spawn: "1" }, $$inline: true });

    	const block = {
    		c: function create() {
    			div7 = element("div");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			div1 = element("div");
    			t2 = text(t2_value);
    			t3 = space();
    			div2 = element("div");
    			t4 = text(t4_value);
    			t5 = space();
    			div3 = element("div");
    			t6 = text(t6_value);
    			t7 = space();
    			div4 = element("div");
    			buttons0.$$.fragment.c();
    			t8 = space();
    			buttons1.$$.fragment.c();
    			t9 = space();
    			buttons2.$$.fragment.c();
    			t10 = space();
    			buttons3.$$.fragment.c();
    			t11 = space();
    			div5 = element("div");
    			dialog0.$$.fragment.c();
    			t12 = space();
    			div6 = element("div");
    			dialog1.$$.fragment.c();
    			attr_dev(div0, "class", "control");
    			attr_dev(div0, "data-test-id", "count-all");
    			add_location(div0, file$8, 17, 2, 926);
    			attr_dev(div1, "class", "control");
    			attr_dev(div1, "data-test-id", "count-id");
    			add_location(div1, file$8, 18, 2, 1013);
    			attr_dev(div2, "class", "control");
    			attr_dev(div2, "data-test-id", "count-spawn");
    			add_location(div2, file$8, 19, 2, 1101);
    			attr_dev(div3, "class", "control");
    			attr_dev(div3, "data-test-id", "count-spawn-id");
    			add_location(div3, file$8, 20, 2, 1198);
    			attr_dev(div4, "class", "content");
    			add_location(div4, file$8, 21, 2, 1305);
    			attr_dev(div5, "class", "spawn default-spawn");
    			add_location(div5, file$8, 27, 2, 1476);
    			attr_dev(div6, "class", "spawn custom-spawn");
    			add_location(div6, file$8, 30, 2, 1536);
    			attr_dev(div7, "class", "test");
    			add_location(div7, file$8, 16, 0, 905);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div0);
    			append_dev(div0, t0);
    			append_dev(div7, t1);
    			append_dev(div7, div1);
    			append_dev(div1, t2);
    			append_dev(div7, t3);
    			append_dev(div7, div2);
    			append_dev(div2, t4);
    			append_dev(div7, t5);
    			append_dev(div7, div3);
    			append_dev(div3, t6);
    			append_dev(div7, t7);
    			append_dev(div7, div4);
    			mount_component(buttons0, div4, null);
    			append_dev(div4, t8);
    			mount_component(buttons1, div4, null);
    			append_dev(div4, t9);
    			mount_component(buttons2, div4, null);
    			append_dev(div4, t10);
    			mount_component(buttons3, div4, null);
    			append_dev(div7, t11);
    			append_dev(div7, div5);
    			mount_component(dialog0, div5, null);
    			append_dev(div7, t12);
    			append_dev(div7, div6);
    			mount_component(dialog1, div6, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if ((!current || changed.$dialogExists) && t0_value !== (t0_value = `Exists any: ${ctx.$dialogExists}` + "")) {
    				set_data_dev(t0, t0_value);
    			}

    			if ((!current || changed.$dialogExistsId1) && t2_value !== (t2_value = `Exists id: ${ctx.$dialogExistsId1}` + "")) {
    				set_data_dev(t2, t2_value);
    			}

    			if ((!current || changed.$dialogExistsSpawn1) && t4_value !== (t4_value = `Exists spawn: ${ctx.$dialogExistsSpawn1}` + "")) {
    				set_data_dev(t4, t4_value);
    			}

    			if ((!current || changed.$dialogExistsSpawn1Id1) && t6_value !== (t6_value = `Exists spawn, id: ${ctx.$dialogExistsSpawn1Id1}` + "")) {
    				set_data_dev(t6, t6_value);
    			}

    			var buttons0_changes = (changed.fns1) ? get_spread_update(buttons0_spread_levels, [
    									get_spread_object(ctx.fns1)
    								]) : {};
    			buttons0.$set(buttons0_changes);

    			var buttons1_changes = (changed.fns2) ? get_spread_update(buttons1_spread_levels, [
    									get_spread_object(ctx.fns2),
    			buttons1_spread_levels[1]
    								]) : {};
    			buttons1.$set(buttons1_changes);

    			var buttons2_changes = (changed.fns3) ? get_spread_update(buttons2_spread_levels, [
    									get_spread_object(ctx.fns3),
    			buttons2_spread_levels[1]
    								]) : {};
    			buttons2.$set(buttons2_changes);

    			var buttons3_changes = (changed.fns4) ? get_spread_update(buttons3_spread_levels, [
    									get_spread_object(ctx.fns4),
    			buttons3_spread_levels[1],
    			buttons3_spread_levels[2]
    								]) : {};
    			buttons3.$set(buttons3_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(buttons0.$$.fragment, local);

    			transition_in(buttons1.$$.fragment, local);

    			transition_in(buttons2.$$.fragment, local);

    			transition_in(buttons3.$$.fragment, local);

    			transition_in(dialog0.$$.fragment, local);

    			transition_in(dialog1.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(buttons0.$$.fragment, local);
    			transition_out(buttons1.$$.fragment, local);
    			transition_out(buttons2.$$.fragment, local);
    			transition_out(buttons3.$$.fragment, local);
    			transition_out(dialog0.$$.fragment, local);
    			transition_out(dialog1.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div7);
    			}

    			destroy_component(buttons0);

    			destroy_component(buttons1);

    			destroy_component(buttons2);

    			destroy_component(buttons3);

    			destroy_component(dialog0);

    			destroy_component(dialog1);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$d.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let $dialogExists, $dialogExistsId1, $dialogExistsSpawn1, $dialogExistsSpawn1Id1;

    	

      const fns1 = createFns({ instance: dialog$1, component: Default, className: "dialog", title: "Default" });
      const fns2 = createFns({ instance: dialog$1, component: Default, className: "dialog", id: "1", title: "ID" });
      const fns3 = createFns({ instance: dialog$1, component: Default, className: "dialog", spawn: "1", title: "Spawn" });
      const fns4 = createFns({ instance: dialog$1, component: Default, className: "dialog", spawn: "1", id: "1", title: "Spawn and ID" });
      const dialogExists = dialog$1.exists(); validate_store(dialogExists, 'dialogExists'); component_subscribe($$self, dialogExists, $$value => { $dialogExists = $$value; $$invalidate('$dialogExists', $dialogExists); });
      const dialogExistsId1 = dialog$1.exists({ id: "1" }); validate_store(dialogExistsId1, 'dialogExistsId1'); component_subscribe($$self, dialogExistsId1, $$value => { $dialogExistsId1 = $$value; $$invalidate('$dialogExistsId1', $dialogExistsId1); });
      const dialogExistsSpawn1 = dialog$1.exists({ spawn: "1" }); validate_store(dialogExistsSpawn1, 'dialogExistsSpawn1'); component_subscribe($$self, dialogExistsSpawn1, $$value => { $dialogExistsSpawn1 = $$value; $$invalidate('$dialogExistsSpawn1', $dialogExistsSpawn1); });
      const dialogExistsSpawn1Id1 = dialog$1.exists({ spawn: "1", id: "1" }); validate_store(dialogExistsSpawn1Id1, 'dialogExistsSpawn1Id1'); component_subscribe($$self, dialogExistsSpawn1Id1, $$value => { $dialogExistsSpawn1Id1 = $$value; $$invalidate('$dialogExistsSpawn1Id1', $dialogExistsSpawn1Id1); });

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ('$dialogExists' in $$props) dialogExists.set($dialogExists);
    		if ('$dialogExistsId1' in $$props) dialogExistsId1.set($dialogExistsId1);
    		if ('$dialogExistsSpawn1' in $$props) dialogExistsSpawn1.set($dialogExistsSpawn1);
    		if ('$dialogExistsSpawn1Id1' in $$props) dialogExistsSpawn1Id1.set($dialogExistsSpawn1Id1);
    	};

    	return {
    		fns1,
    		fns2,
    		fns3,
    		fns4,
    		dialogExists,
    		dialogExistsId1,
    		dialogExistsSpawn1,
    		dialogExistsSpawn1Id1,
    		$dialogExists,
    		$dialogExistsId1,
    		$dialogExistsSpawn1,
    		$dialogExistsSpawn1Id1
    	};
    }

    class DialogExists extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$d, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "DialogExists", options, id: create_fragment$d.name });
    	}
    }

    /* src/cypress-tests/DialogCount.svelte generated by Svelte v3.12.1 */

    const file$9 = "src/cypress-tests/DialogCount.svelte";

    function create_fragment$e(ctx) {
    	var div9, div0, t0_value = `Count all: ${ctx.$dialogCount}` + "", t0, t1, div1, t2_value = `Count id: ${ctx.$dialogCountId1}` + "", t2, t3, div2, t4_value = `Count spawn: ${ctx.$dialogCountSpawn1}` + "", t4, t5, div3, t6_value = `Count spawn, id: ${ctx.$dialogCountSpawn1Id1}` + "", t6, t7, div4, t8_value = `Count spawn, queued: ${ctx.$dialogCountSpawn2Queued}` + "", t8, t9, div5, t10, t11, t12, t13, t14, div6, t15, div7, t16, div8, current;

    	var buttons0_spread_levels = [
    		ctx.fns1
    	];

    	let buttons0_props = {};
    	for (var i = 0; i < buttons0_spread_levels.length; i += 1) {
    		buttons0_props = assign(buttons0_props, buttons0_spread_levels[i]);
    	}
    	var buttons0 = new Buttons({ props: buttons0_props, $$inline: true });

    	var buttons1_spread_levels = [
    		ctx.fns2,
    		{ id: "1" }
    	];

    	let buttons1_props = {};
    	for (var i = 0; i < buttons1_spread_levels.length; i += 1) {
    		buttons1_props = assign(buttons1_props, buttons1_spread_levels[i]);
    	}
    	var buttons1 = new Buttons({ props: buttons1_props, $$inline: true });

    	var buttons2_spread_levels = [
    		ctx.fns3,
    		{ spawn: "1" }
    	];

    	let buttons2_props = {};
    	for (var i = 0; i < buttons2_spread_levels.length; i += 1) {
    		buttons2_props = assign(buttons2_props, buttons2_spread_levels[i]);
    	}
    	var buttons2 = new Buttons({ props: buttons2_props, $$inline: true });

    	var buttons3_spread_levels = [
    		ctx.fns4,
    		{ spawn: "1" },
    		{ id: "1" }
    	];

    	let buttons3_props = {};
    	for (var i = 0; i < buttons3_spread_levels.length; i += 1) {
    		buttons3_props = assign(buttons3_props, buttons3_spread_levels[i]);
    	}
    	var buttons3 = new Buttons({ props: buttons3_props, $$inline: true });

    	var buttons4_spread_levels = [
    		ctx.fns5,
    		{ spawn: "2" },
    		{ name: "queued" }
    	];

    	let buttons4_props = {};
    	for (var i = 0; i < buttons4_spread_levels.length; i += 1) {
    		buttons4_props = assign(buttons4_props, buttons4_spread_levels[i]);
    	}
    	var buttons4 = new Buttons({ props: buttons4_props, $$inline: true });

    	var dialog0 = new Dialog({ $$inline: true });

    	var dialog1 = new Dialog({ props: { spawn: "1" }, $$inline: true });

    	var dialog2 = new Dialog({ props: { spawn: "2" }, $$inline: true });

    	const block = {
    		c: function create() {
    			div9 = element("div");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			div1 = element("div");
    			t2 = text(t2_value);
    			t3 = space();
    			div2 = element("div");
    			t4 = text(t4_value);
    			t5 = space();
    			div3 = element("div");
    			t6 = text(t6_value);
    			t7 = space();
    			div4 = element("div");
    			t8 = text(t8_value);
    			t9 = space();
    			div5 = element("div");
    			buttons0.$$.fragment.c();
    			t10 = space();
    			buttons1.$$.fragment.c();
    			t11 = space();
    			buttons2.$$.fragment.c();
    			t12 = space();
    			buttons3.$$.fragment.c();
    			t13 = space();
    			buttons4.$$.fragment.c();
    			t14 = space();
    			div6 = element("div");
    			dialog0.$$.fragment.c();
    			t15 = space();
    			div7 = element("div");
    			dialog1.$$.fragment.c();
    			t16 = space();
    			div8 = element("div");
    			dialog2.$$.fragment.c();
    			attr_dev(div0, "class", "control");
    			attr_dev(div0, "data-test-id", "count-all");
    			add_location(div0, file$9, 19, 2, 1135);
    			attr_dev(div1, "class", "control");
    			attr_dev(div1, "data-test-id", "count-id");
    			add_location(div1, file$9, 20, 2, 1220);
    			attr_dev(div2, "class", "control");
    			attr_dev(div2, "data-test-id", "count-spawn");
    			add_location(div2, file$9, 21, 2, 1306);
    			attr_dev(div3, "class", "control");
    			attr_dev(div3, "data-test-id", "count-spawn-id");
    			add_location(div3, file$9, 22, 2, 1401);
    			attr_dev(div4, "class", "control");
    			attr_dev(div4, "data-test-id", "count-spawn-queued");
    			add_location(div4, file$9, 23, 2, 1506);
    			attr_dev(div5, "class", "content");
    			add_location(div5, file$9, 24, 2, 1622);
    			attr_dev(div6, "class", "spawn default-spawn");
    			add_location(div6, file$9, 31, 2, 1843);
    			attr_dev(div7, "class", "spawn custom-spawn");
    			add_location(div7, file$9, 34, 2, 1903);
    			attr_dev(div8, "class", "spawn custom-spawn");
    			add_location(div8, file$9, 37, 2, 1972);
    			attr_dev(div9, "class", "test");
    			add_location(div9, file$9, 18, 0, 1114);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div9, anchor);
    			append_dev(div9, div0);
    			append_dev(div0, t0);
    			append_dev(div9, t1);
    			append_dev(div9, div1);
    			append_dev(div1, t2);
    			append_dev(div9, t3);
    			append_dev(div9, div2);
    			append_dev(div2, t4);
    			append_dev(div9, t5);
    			append_dev(div9, div3);
    			append_dev(div3, t6);
    			append_dev(div9, t7);
    			append_dev(div9, div4);
    			append_dev(div4, t8);
    			append_dev(div9, t9);
    			append_dev(div9, div5);
    			mount_component(buttons0, div5, null);
    			append_dev(div5, t10);
    			mount_component(buttons1, div5, null);
    			append_dev(div5, t11);
    			mount_component(buttons2, div5, null);
    			append_dev(div5, t12);
    			mount_component(buttons3, div5, null);
    			append_dev(div5, t13);
    			mount_component(buttons4, div5, null);
    			append_dev(div9, t14);
    			append_dev(div9, div6);
    			mount_component(dialog0, div6, null);
    			append_dev(div9, t15);
    			append_dev(div9, div7);
    			mount_component(dialog1, div7, null);
    			append_dev(div9, t16);
    			append_dev(div9, div8);
    			mount_component(dialog2, div8, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if ((!current || changed.$dialogCount) && t0_value !== (t0_value = `Count all: ${ctx.$dialogCount}` + "")) {
    				set_data_dev(t0, t0_value);
    			}

    			if ((!current || changed.$dialogCountId1) && t2_value !== (t2_value = `Count id: ${ctx.$dialogCountId1}` + "")) {
    				set_data_dev(t2, t2_value);
    			}

    			if ((!current || changed.$dialogCountSpawn1) && t4_value !== (t4_value = `Count spawn: ${ctx.$dialogCountSpawn1}` + "")) {
    				set_data_dev(t4, t4_value);
    			}

    			if ((!current || changed.$dialogCountSpawn1Id1) && t6_value !== (t6_value = `Count spawn, id: ${ctx.$dialogCountSpawn1Id1}` + "")) {
    				set_data_dev(t6, t6_value);
    			}

    			if ((!current || changed.$dialogCountSpawn2Queued) && t8_value !== (t8_value = `Count spawn, queued: ${ctx.$dialogCountSpawn2Queued}` + "")) {
    				set_data_dev(t8, t8_value);
    			}

    			var buttons0_changes = (changed.fns1) ? get_spread_update(buttons0_spread_levels, [
    									get_spread_object(ctx.fns1)
    								]) : {};
    			buttons0.$set(buttons0_changes);

    			var buttons1_changes = (changed.fns2) ? get_spread_update(buttons1_spread_levels, [
    									get_spread_object(ctx.fns2),
    			buttons1_spread_levels[1]
    								]) : {};
    			buttons1.$set(buttons1_changes);

    			var buttons2_changes = (changed.fns3) ? get_spread_update(buttons2_spread_levels, [
    									get_spread_object(ctx.fns3),
    			buttons2_spread_levels[1]
    								]) : {};
    			buttons2.$set(buttons2_changes);

    			var buttons3_changes = (changed.fns4) ? get_spread_update(buttons3_spread_levels, [
    									get_spread_object(ctx.fns4),
    			buttons3_spread_levels[1],
    			buttons3_spread_levels[2]
    								]) : {};
    			buttons3.$set(buttons3_changes);

    			var buttons4_changes = (changed.fns5) ? get_spread_update(buttons4_spread_levels, [
    									get_spread_object(ctx.fns5),
    			buttons4_spread_levels[1],
    			buttons4_spread_levels[2]
    								]) : {};
    			buttons4.$set(buttons4_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(buttons0.$$.fragment, local);

    			transition_in(buttons1.$$.fragment, local);

    			transition_in(buttons2.$$.fragment, local);

    			transition_in(buttons3.$$.fragment, local);

    			transition_in(buttons4.$$.fragment, local);

    			transition_in(dialog0.$$.fragment, local);

    			transition_in(dialog1.$$.fragment, local);

    			transition_in(dialog2.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(buttons0.$$.fragment, local);
    			transition_out(buttons1.$$.fragment, local);
    			transition_out(buttons2.$$.fragment, local);
    			transition_out(buttons3.$$.fragment, local);
    			transition_out(buttons4.$$.fragment, local);
    			transition_out(dialog0.$$.fragment, local);
    			transition_out(dialog1.$$.fragment, local);
    			transition_out(dialog2.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div9);
    			}

    			destroy_component(buttons0);

    			destroy_component(buttons1);

    			destroy_component(buttons2);

    			destroy_component(buttons3);

    			destroy_component(buttons4);

    			destroy_component(dialog0);

    			destroy_component(dialog1);

    			destroy_component(dialog2);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$e.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let $dialogCount, $dialogCountId1, $dialogCountSpawn1, $dialogCountSpawn1Id1, $dialogCountSpawn2Queued;

    	

      const fns1 = createFns({ instance: dialog$1, component: Default, className: "dialog", title: "Default" });
      const fns2 = createFns({ instance: dialog$1, component: Default, className: "dialog", id: "1", title: "ID" });
      const fns3 = createFns({ instance: dialog$1, component: Default, className: "dialog", spawn: "1", title: "Spawn" });
      const fns4 = createFns({ instance: dialog$1, component: Default, className: "dialog", spawn: "1", id: "1", title: "Spawn and ID" });
      const fns5 = createFns({ instance: dialog$1, component: Default, className: "dialog", spawn: "2", title: "Spawn queued", queued: true });
      const dialogCount = dialog$1.getCount(); validate_store(dialogCount, 'dialogCount'); component_subscribe($$self, dialogCount, $$value => { $dialogCount = $$value; $$invalidate('$dialogCount', $dialogCount); });
      const dialogCountId1 = dialog$1.getCount({ id: "1" }); validate_store(dialogCountId1, 'dialogCountId1'); component_subscribe($$self, dialogCountId1, $$value => { $dialogCountId1 = $$value; $$invalidate('$dialogCountId1', $dialogCountId1); });
      const dialogCountSpawn1 = dialog$1.getCount({ spawn: "1" }); validate_store(dialogCountSpawn1, 'dialogCountSpawn1'); component_subscribe($$self, dialogCountSpawn1, $$value => { $dialogCountSpawn1 = $$value; $$invalidate('$dialogCountSpawn1', $dialogCountSpawn1); });
      const dialogCountSpawn1Id1 = dialog$1.getCount({ spawn: "1", id: "1" }); validate_store(dialogCountSpawn1Id1, 'dialogCountSpawn1Id1'); component_subscribe($$self, dialogCountSpawn1Id1, $$value => { $dialogCountSpawn1Id1 = $$value; $$invalidate('$dialogCountSpawn1Id1', $dialogCountSpawn1Id1); });
      const dialogCountSpawn2Queued = dialog$1.getCount({ spawn: "2" }); validate_store(dialogCountSpawn2Queued, 'dialogCountSpawn2Queued'); component_subscribe($$self, dialogCountSpawn2Queued, $$value => { $dialogCountSpawn2Queued = $$value; $$invalidate('$dialogCountSpawn2Queued', $dialogCountSpawn2Queued); });

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ('$dialogCount' in $$props) dialogCount.set($dialogCount);
    		if ('$dialogCountId1' in $$props) dialogCountId1.set($dialogCountId1);
    		if ('$dialogCountSpawn1' in $$props) dialogCountSpawn1.set($dialogCountSpawn1);
    		if ('$dialogCountSpawn1Id1' in $$props) dialogCountSpawn1Id1.set($dialogCountSpawn1Id1);
    		if ('$dialogCountSpawn2Queued' in $$props) dialogCountSpawn2Queued.set($dialogCountSpawn2Queued);
    	};

    	return {
    		fns1,
    		fns2,
    		fns3,
    		fns4,
    		fns5,
    		dialogCount,
    		dialogCountId1,
    		dialogCountSpawn1,
    		dialogCountSpawn1Id1,
    		dialogCountSpawn2Queued,
    		$dialogCount,
    		$dialogCountId1,
    		$dialogCountSpawn1,
    		$dialogCountSpawn1Id1,
    		$dialogCountSpawn2Queued
    	};
    }

    class DialogCount extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$e, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "DialogCount", options, id: create_fragment$e.name });
    	}
    }

    /* src/cypress-tests/DialogHideAll.svelte generated by Svelte v3.12.1 */

    const file$a = "src/cypress-tests/DialogHideAll.svelte";

    function create_fragment$f(ctx) {
    	var div9, div0, t0_value = `Count all: ${ctx.$dialogCount}` + "", t0, t1, div1, t2_value = `Count id: ${ctx.$dialogCountId1}` + "", t2, t3, div2, t4_value = `Count spawn: ${ctx.$dialogCountSpawn1}` + "", t4, t5, div3, t6_value = `Count spawn, id: ${ctx.$dialogCountSpawn1Id1}` + "", t6, t7, div5, div4, button0, t9, button1, t11, button2, t13, button3, t15, div6, t16, t17, t18, t19, div7, t20, div8, current, dispose;

    	var buttons0_spread_levels = [
    		ctx.fns1
    	];

    	let buttons0_props = {};
    	for (var i = 0; i < buttons0_spread_levels.length; i += 1) {
    		buttons0_props = assign(buttons0_props, buttons0_spread_levels[i]);
    	}
    	var buttons0 = new Buttons({ props: buttons0_props, $$inline: true });

    	var buttons1_spread_levels = [
    		ctx.fns2,
    		{ id: "1" }
    	];

    	let buttons1_props = {};
    	for (var i = 0; i < buttons1_spread_levels.length; i += 1) {
    		buttons1_props = assign(buttons1_props, buttons1_spread_levels[i]);
    	}
    	var buttons1 = new Buttons({ props: buttons1_props, $$inline: true });

    	var buttons2_spread_levels = [
    		ctx.fns3,
    		{ spawn: "1" }
    	];

    	let buttons2_props = {};
    	for (var i = 0; i < buttons2_spread_levels.length; i += 1) {
    		buttons2_props = assign(buttons2_props, buttons2_spread_levels[i]);
    	}
    	var buttons2 = new Buttons({ props: buttons2_props, $$inline: true });

    	var buttons3_spread_levels = [
    		ctx.fns4,
    		{ spawn: "1" },
    		{ id: "1" }
    	];

    	let buttons3_props = {};
    	for (var i = 0; i < buttons3_spread_levels.length; i += 1) {
    		buttons3_props = assign(buttons3_props, buttons3_spread_levels[i]);
    	}
    	var buttons3 = new Buttons({ props: buttons3_props, $$inline: true });

    	var dialog0 = new Dialog({ $$inline: true });

    	var dialog1 = new Dialog({ props: { spawn: "1" }, $$inline: true });

    	const block = {
    		c: function create() {
    			div9 = element("div");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			div1 = element("div");
    			t2 = text(t2_value);
    			t3 = space();
    			div2 = element("div");
    			t4 = text(t4_value);
    			t5 = space();
    			div3 = element("div");
    			t6 = text(t6_value);
    			t7 = space();
    			div5 = element("div");
    			div4 = element("div");
    			button0 = element("button");
    			button0.textContent = "Hide all";
    			t9 = space();
    			button1 = element("button");
    			button1.textContent = "Hide all with id";
    			t11 = space();
    			button2 = element("button");
    			button2.textContent = "Hide all with spawn";
    			t13 = space();
    			button3 = element("button");
    			button3.textContent = "Hide all with spawn and id";
    			t15 = space();
    			div6 = element("div");
    			buttons0.$$.fragment.c();
    			t16 = space();
    			buttons1.$$.fragment.c();
    			t17 = space();
    			buttons2.$$.fragment.c();
    			t18 = space();
    			buttons3.$$.fragment.c();
    			t19 = space();
    			div7 = element("div");
    			dialog0.$$.fragment.c();
    			t20 = space();
    			div8 = element("div");
    			dialog1.$$.fragment.c();
    			attr_dev(div0, "class", "control");
    			attr_dev(div0, "data-test-id", "count-all");
    			add_location(div0, file$a, 17, 2, 930);
    			attr_dev(div1, "class", "control");
    			attr_dev(div1, "data-test-id", "count-id");
    			add_location(div1, file$a, 18, 2, 1015);
    			attr_dev(div2, "class", "control");
    			attr_dev(div2, "data-test-id", "count-spawn");
    			add_location(div2, file$a, 19, 2, 1101);
    			attr_dev(div3, "class", "control");
    			attr_dev(div3, "data-test-id", "count-spawn-id");
    			add_location(div3, file$a, 20, 2, 1196);
    			attr_dev(button0, "class", "button");
    			attr_dev(button0, "data-test-id", "button-hide-all");
    			add_location(button0, file$a, 23, 6, 1379);
    			attr_dev(button1, "class", "button");
    			attr_dev(button1, "data-test-id", "button-hide-all-id");
    			add_location(button1, file$a, 26, 6, 1507);
    			attr_dev(button2, "class", "button");
    			attr_dev(button2, "data-test-id", "button-hide-all-spawn");
    			add_location(button2, file$a, 29, 6, 1657);
    			attr_dev(button3, "class", "button");
    			attr_dev(button3, "data-test-id", "button-hide-all-spawn-id");
    			add_location(button3, file$a, 32, 6, 1816);
    			attr_dev(div4, "class", "buttons");
    			add_location(div4, file$a, 22, 4, 1351);
    			attr_dev(div5, "class", "control");
    			attr_dev(div5, "data-test-id", "hide-all");
    			add_location(div5, file$a, 21, 2, 1301);
    			attr_dev(div6, "class", "content");
    			add_location(div6, file$a, 37, 2, 2010);
    			attr_dev(div7, "class", "spawn default-spawn");
    			add_location(div7, file$a, 43, 2, 2181);
    			attr_dev(div8, "class", "spawn custom-spawn");
    			add_location(div8, file$a, 46, 2, 2241);
    			attr_dev(div9, "class", "test");
    			add_location(div9, file$a, 16, 0, 909);

    			dispose = [
    				listen_dev(button0, "click", ctx.click_handler),
    				listen_dev(button1, "click", ctx.click_handler_1),
    				listen_dev(button2, "click", ctx.click_handler_2),
    				listen_dev(button3, "click", ctx.click_handler_3)
    			];
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div9, anchor);
    			append_dev(div9, div0);
    			append_dev(div0, t0);
    			append_dev(div9, t1);
    			append_dev(div9, div1);
    			append_dev(div1, t2);
    			append_dev(div9, t3);
    			append_dev(div9, div2);
    			append_dev(div2, t4);
    			append_dev(div9, t5);
    			append_dev(div9, div3);
    			append_dev(div3, t6);
    			append_dev(div9, t7);
    			append_dev(div9, div5);
    			append_dev(div5, div4);
    			append_dev(div4, button0);
    			append_dev(div4, t9);
    			append_dev(div4, button1);
    			append_dev(div4, t11);
    			append_dev(div4, button2);
    			append_dev(div4, t13);
    			append_dev(div4, button3);
    			append_dev(div9, t15);
    			append_dev(div9, div6);
    			mount_component(buttons0, div6, null);
    			append_dev(div6, t16);
    			mount_component(buttons1, div6, null);
    			append_dev(div6, t17);
    			mount_component(buttons2, div6, null);
    			append_dev(div6, t18);
    			mount_component(buttons3, div6, null);
    			append_dev(div9, t19);
    			append_dev(div9, div7);
    			mount_component(dialog0, div7, null);
    			append_dev(div9, t20);
    			append_dev(div9, div8);
    			mount_component(dialog1, div8, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if ((!current || changed.$dialogCount) && t0_value !== (t0_value = `Count all: ${ctx.$dialogCount}` + "")) {
    				set_data_dev(t0, t0_value);
    			}

    			if ((!current || changed.$dialogCountId1) && t2_value !== (t2_value = `Count id: ${ctx.$dialogCountId1}` + "")) {
    				set_data_dev(t2, t2_value);
    			}

    			if ((!current || changed.$dialogCountSpawn1) && t4_value !== (t4_value = `Count spawn: ${ctx.$dialogCountSpawn1}` + "")) {
    				set_data_dev(t4, t4_value);
    			}

    			if ((!current || changed.$dialogCountSpawn1Id1) && t6_value !== (t6_value = `Count spawn, id: ${ctx.$dialogCountSpawn1Id1}` + "")) {
    				set_data_dev(t6, t6_value);
    			}

    			var buttons0_changes = (changed.fns1) ? get_spread_update(buttons0_spread_levels, [
    									get_spread_object(ctx.fns1)
    								]) : {};
    			buttons0.$set(buttons0_changes);

    			var buttons1_changes = (changed.fns2) ? get_spread_update(buttons1_spread_levels, [
    									get_spread_object(ctx.fns2),
    			buttons1_spread_levels[1]
    								]) : {};
    			buttons1.$set(buttons1_changes);

    			var buttons2_changes = (changed.fns3) ? get_spread_update(buttons2_spread_levels, [
    									get_spread_object(ctx.fns3),
    			buttons2_spread_levels[1]
    								]) : {};
    			buttons2.$set(buttons2_changes);

    			var buttons3_changes = (changed.fns4) ? get_spread_update(buttons3_spread_levels, [
    									get_spread_object(ctx.fns4),
    			buttons3_spread_levels[1],
    			buttons3_spread_levels[2]
    								]) : {};
    			buttons3.$set(buttons3_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(buttons0.$$.fragment, local);

    			transition_in(buttons1.$$.fragment, local);

    			transition_in(buttons2.$$.fragment, local);

    			transition_in(buttons3.$$.fragment, local);

    			transition_in(dialog0.$$.fragment, local);

    			transition_in(dialog1.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(buttons0.$$.fragment, local);
    			transition_out(buttons1.$$.fragment, local);
    			transition_out(buttons2.$$.fragment, local);
    			transition_out(buttons3.$$.fragment, local);
    			transition_out(dialog0.$$.fragment, local);
    			transition_out(dialog1.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div9);
    			}

    			destroy_component(buttons0);

    			destroy_component(buttons1);

    			destroy_component(buttons2);

    			destroy_component(buttons3);

    			destroy_component(dialog0);

    			destroy_component(dialog1);

    			run_all(dispose);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$f.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let $dialogCount, $dialogCountId1, $dialogCountSpawn1, $dialogCountSpawn1Id1;

    	

      const fns1 = createFns({ instance: dialog$1, component: Default, className: "dialog", title: "Default" });
      const fns2 = createFns({ instance: dialog$1, component: Default, className: "dialog", id: "1", title: "ID" });
      const fns3 = createFns({ instance: dialog$1, component: Default, className: "dialog", spawn: "1", title: "Spawn" });
      const fns4 = createFns({ instance: dialog$1, component: Default, className: "dialog", spawn: "1", id: "1", title: "Spawn and ID" });
      const dialogCount = dialog$1.getCount(); validate_store(dialogCount, 'dialogCount'); component_subscribe($$self, dialogCount, $$value => { $dialogCount = $$value; $$invalidate('$dialogCount', $dialogCount); });
      const dialogCountId1 = dialog$1.getCount({ id: "1" }); validate_store(dialogCountId1, 'dialogCountId1'); component_subscribe($$self, dialogCountId1, $$value => { $dialogCountId1 = $$value; $$invalidate('$dialogCountId1', $dialogCountId1); });
      const dialogCountSpawn1 = dialog$1.getCount({ spawn: "1" }); validate_store(dialogCountSpawn1, 'dialogCountSpawn1'); component_subscribe($$self, dialogCountSpawn1, $$value => { $dialogCountSpawn1 = $$value; $$invalidate('$dialogCountSpawn1', $dialogCountSpawn1); });
      const dialogCountSpawn1Id1 = dialog$1.getCount({ spawn: "1", id: "1" }); validate_store(dialogCountSpawn1Id1, 'dialogCountSpawn1Id1'); component_subscribe($$self, dialogCountSpawn1Id1, $$value => { $dialogCountSpawn1Id1 = $$value; $$invalidate('$dialogCountSpawn1Id1', $dialogCountSpawn1Id1); });

    	const click_handler = () => dialog$1.hideAll();

    	const click_handler_1 = () => dialog$1.hideAll({ id: "1" });

    	const click_handler_2 = () => dialog$1.hideAll({ spawn: "1" });

    	const click_handler_3 = () => dialog$1.hideAll({ id: "1", spawn: "1" });

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ('$dialogCount' in $$props) dialogCount.set($dialogCount);
    		if ('$dialogCountId1' in $$props) dialogCountId1.set($dialogCountId1);
    		if ('$dialogCountSpawn1' in $$props) dialogCountSpawn1.set($dialogCountSpawn1);
    		if ('$dialogCountSpawn1Id1' in $$props) dialogCountSpawn1Id1.set($dialogCountSpawn1Id1);
    	};

    	return {
    		fns1,
    		fns2,
    		fns3,
    		fns4,
    		dialogCount,
    		dialogCountId1,
    		dialogCountSpawn1,
    		dialogCountSpawn1Id1,
    		$dialogCount,
    		$dialogCountId1,
    		$dialogCountSpawn1,
    		$dialogCountSpawn1Id1,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3
    	};
    }

    class DialogHideAll extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$f, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "DialogHideAll", options, id: create_fragment$f.name });
    	}
    }

    /* src/cypress-tests/DialogResetAll.svelte generated by Svelte v3.12.1 */

    const file$b = "src/cypress-tests/DialogResetAll.svelte";

    function create_fragment$g(ctx) {
    	var div9, div0, t0_value = `Count all: ${ctx.$dialogCount}` + "", t0, t1, div1, t2_value = `Count id: ${ctx.$dialogCountId1}` + "", t2, t3, div2, t4_value = `Count spawn: ${ctx.$dialogCountSpawn1}` + "", t4, t5, div3, t6_value = `Count spawn, id: ${ctx.$dialogCountSpawn1Id1}` + "", t6, t7, div5, div4, button0, t9, button1, t11, button2, t13, button3, t15, div6, t16, t17, t18, t19, div7, t20, div8, current, dispose;

    	var buttons0_spread_levels = [
    		ctx.fns1
    	];

    	let buttons0_props = {};
    	for (var i = 0; i < buttons0_spread_levels.length; i += 1) {
    		buttons0_props = assign(buttons0_props, buttons0_spread_levels[i]);
    	}
    	var buttons0 = new Buttons({ props: buttons0_props, $$inline: true });

    	var buttons1_spread_levels = [
    		ctx.fns2,
    		{ id: "1" }
    	];

    	let buttons1_props = {};
    	for (var i = 0; i < buttons1_spread_levels.length; i += 1) {
    		buttons1_props = assign(buttons1_props, buttons1_spread_levels[i]);
    	}
    	var buttons1 = new Buttons({ props: buttons1_props, $$inline: true });

    	var buttons2_spread_levels = [
    		ctx.fns3,
    		{ spawn: "1" }
    	];

    	let buttons2_props = {};
    	for (var i = 0; i < buttons2_spread_levels.length; i += 1) {
    		buttons2_props = assign(buttons2_props, buttons2_spread_levels[i]);
    	}
    	var buttons2 = new Buttons({ props: buttons2_props, $$inline: true });

    	var buttons3_spread_levels = [
    		ctx.fns4,
    		{ spawn: "1" },
    		{ id: "1" }
    	];

    	let buttons3_props = {};
    	for (var i = 0; i < buttons3_spread_levels.length; i += 1) {
    		buttons3_props = assign(buttons3_props, buttons3_spread_levels[i]);
    	}
    	var buttons3 = new Buttons({ props: buttons3_props, $$inline: true });

    	var dialog0 = new Dialog({ $$inline: true });

    	var dialog1 = new Dialog({ props: { spawn: "1" }, $$inline: true });

    	const block = {
    		c: function create() {
    			div9 = element("div");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			div1 = element("div");
    			t2 = text(t2_value);
    			t3 = space();
    			div2 = element("div");
    			t4 = text(t4_value);
    			t5 = space();
    			div3 = element("div");
    			t6 = text(t6_value);
    			t7 = space();
    			div5 = element("div");
    			div4 = element("div");
    			button0 = element("button");
    			button0.textContent = "Reset all";
    			t9 = space();
    			button1 = element("button");
    			button1.textContent = "Reset all with id";
    			t11 = space();
    			button2 = element("button");
    			button2.textContent = "Reset all with spawn";
    			t13 = space();
    			button3 = element("button");
    			button3.textContent = "Reset all with spawn and id";
    			t15 = space();
    			div6 = element("div");
    			buttons0.$$.fragment.c();
    			t16 = space();
    			buttons1.$$.fragment.c();
    			t17 = space();
    			buttons2.$$.fragment.c();
    			t18 = space();
    			buttons3.$$.fragment.c();
    			t19 = space();
    			div7 = element("div");
    			dialog0.$$.fragment.c();
    			t20 = space();
    			div8 = element("div");
    			dialog1.$$.fragment.c();
    			attr_dev(div0, "class", "control");
    			attr_dev(div0, "data-test-id", "count-all");
    			add_location(div0, file$b, 17, 2, 943);
    			attr_dev(div1, "class", "control");
    			attr_dev(div1, "data-test-id", "count-id");
    			add_location(div1, file$b, 18, 2, 1028);
    			attr_dev(div2, "class", "control");
    			attr_dev(div2, "data-test-id", "count-spawn");
    			add_location(div2, file$b, 19, 2, 1114);
    			attr_dev(div3, "class", "control");
    			attr_dev(div3, "data-test-id", "count-spawn-id");
    			add_location(div3, file$b, 20, 2, 1209);
    			attr_dev(button0, "class", "button");
    			attr_dev(button0, "data-test-id", "button-reset-all");
    			add_location(button0, file$b, 23, 6, 1393);
    			attr_dev(button1, "class", "button");
    			attr_dev(button1, "data-test-id", "button-reset-all-id");
    			add_location(button1, file$b, 26, 6, 1524);
    			attr_dev(button2, "class", "button");
    			attr_dev(button2, "data-test-id", "button-reset-all-spawn");
    			add_location(button2, file$b, 29, 6, 1677);
    			attr_dev(button3, "class", "button");
    			attr_dev(button3, "data-test-id", "button-reset-all-spawn-id");
    			add_location(button3, file$b, 32, 6, 1839);
    			attr_dev(div4, "class", "buttons");
    			add_location(div4, file$b, 22, 4, 1365);
    			attr_dev(div5, "class", "control");
    			attr_dev(div5, "data-test-id", "reset-all");
    			add_location(div5, file$b, 21, 2, 1314);
    			attr_dev(div6, "class", "content");
    			add_location(div6, file$b, 37, 2, 2036);
    			attr_dev(div7, "class", "spawn default-spawn");
    			add_location(div7, file$b, 43, 2, 2207);
    			attr_dev(div8, "class", "spawn custom-spawn");
    			add_location(div8, file$b, 46, 2, 2267);
    			attr_dev(div9, "class", "test");
    			add_location(div9, file$b, 16, 0, 922);

    			dispose = [
    				listen_dev(button0, "click", ctx.click_handler),
    				listen_dev(button1, "click", ctx.click_handler_1),
    				listen_dev(button2, "click", ctx.click_handler_2),
    				listen_dev(button3, "click", ctx.click_handler_3)
    			];
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div9, anchor);
    			append_dev(div9, div0);
    			append_dev(div0, t0);
    			append_dev(div9, t1);
    			append_dev(div9, div1);
    			append_dev(div1, t2);
    			append_dev(div9, t3);
    			append_dev(div9, div2);
    			append_dev(div2, t4);
    			append_dev(div9, t5);
    			append_dev(div9, div3);
    			append_dev(div3, t6);
    			append_dev(div9, t7);
    			append_dev(div9, div5);
    			append_dev(div5, div4);
    			append_dev(div4, button0);
    			append_dev(div4, t9);
    			append_dev(div4, button1);
    			append_dev(div4, t11);
    			append_dev(div4, button2);
    			append_dev(div4, t13);
    			append_dev(div4, button3);
    			append_dev(div9, t15);
    			append_dev(div9, div6);
    			mount_component(buttons0, div6, null);
    			append_dev(div6, t16);
    			mount_component(buttons1, div6, null);
    			append_dev(div6, t17);
    			mount_component(buttons2, div6, null);
    			append_dev(div6, t18);
    			mount_component(buttons3, div6, null);
    			append_dev(div9, t19);
    			append_dev(div9, div7);
    			mount_component(dialog0, div7, null);
    			append_dev(div9, t20);
    			append_dev(div9, div8);
    			mount_component(dialog1, div8, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if ((!current || changed.$dialogCount) && t0_value !== (t0_value = `Count all: ${ctx.$dialogCount}` + "")) {
    				set_data_dev(t0, t0_value);
    			}

    			if ((!current || changed.$dialogCountId1) && t2_value !== (t2_value = `Count id: ${ctx.$dialogCountId1}` + "")) {
    				set_data_dev(t2, t2_value);
    			}

    			if ((!current || changed.$dialogCountSpawn1) && t4_value !== (t4_value = `Count spawn: ${ctx.$dialogCountSpawn1}` + "")) {
    				set_data_dev(t4, t4_value);
    			}

    			if ((!current || changed.$dialogCountSpawn1Id1) && t6_value !== (t6_value = `Count spawn, id: ${ctx.$dialogCountSpawn1Id1}` + "")) {
    				set_data_dev(t6, t6_value);
    			}

    			var buttons0_changes = (changed.fns1) ? get_spread_update(buttons0_spread_levels, [
    									get_spread_object(ctx.fns1)
    								]) : {};
    			buttons0.$set(buttons0_changes);

    			var buttons1_changes = (changed.fns2) ? get_spread_update(buttons1_spread_levels, [
    									get_spread_object(ctx.fns2),
    			buttons1_spread_levels[1]
    								]) : {};
    			buttons1.$set(buttons1_changes);

    			var buttons2_changes = (changed.fns3) ? get_spread_update(buttons2_spread_levels, [
    									get_spread_object(ctx.fns3),
    			buttons2_spread_levels[1]
    								]) : {};
    			buttons2.$set(buttons2_changes);

    			var buttons3_changes = (changed.fns4) ? get_spread_update(buttons3_spread_levels, [
    									get_spread_object(ctx.fns4),
    			buttons3_spread_levels[1],
    			buttons3_spread_levels[2]
    								]) : {};
    			buttons3.$set(buttons3_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(buttons0.$$.fragment, local);

    			transition_in(buttons1.$$.fragment, local);

    			transition_in(buttons2.$$.fragment, local);

    			transition_in(buttons3.$$.fragment, local);

    			transition_in(dialog0.$$.fragment, local);

    			transition_in(dialog1.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(buttons0.$$.fragment, local);
    			transition_out(buttons1.$$.fragment, local);
    			transition_out(buttons2.$$.fragment, local);
    			transition_out(buttons3.$$.fragment, local);
    			transition_out(dialog0.$$.fragment, local);
    			transition_out(dialog1.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div9);
    			}

    			destroy_component(buttons0);

    			destroy_component(buttons1);

    			destroy_component(buttons2);

    			destroy_component(buttons3);

    			destroy_component(dialog0);

    			destroy_component(dialog1);

    			run_all(dispose);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$g.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let $dialogCount, $dialogCountId1, $dialogCountSpawn1, $dialogCountSpawn1Id1;

    	

      const fns1 = createFns({ instance: dialog$1, component: Default, className: "dialog", title: "Default" });
      const fns2 = createFns({ instance: dialog$1, component: Default, className: "dialog dialog-delay", id: "1", title: "ID" });
      const fns3 = createFns({ instance: dialog$1, component: Default, className: "dialog", spawn: "1", title: "Spawn" });
      const fns4 = createFns({ instance: dialog$1, component: Default, className: "dialog", spawn: "1", id: "1", title: "Spawn and ID" });
      const dialogCount = dialog$1.getCount(); validate_store(dialogCount, 'dialogCount'); component_subscribe($$self, dialogCount, $$value => { $dialogCount = $$value; $$invalidate('$dialogCount', $dialogCount); });
      const dialogCountId1 = dialog$1.getCount({ id: "1" }); validate_store(dialogCountId1, 'dialogCountId1'); component_subscribe($$self, dialogCountId1, $$value => { $dialogCountId1 = $$value; $$invalidate('$dialogCountId1', $dialogCountId1); });
      const dialogCountSpawn1 = dialog$1.getCount({ spawn: "1" }); validate_store(dialogCountSpawn1, 'dialogCountSpawn1'); component_subscribe($$self, dialogCountSpawn1, $$value => { $dialogCountSpawn1 = $$value; $$invalidate('$dialogCountSpawn1', $dialogCountSpawn1); });
      const dialogCountSpawn1Id1 = dialog$1.getCount({ spawn: "1", id: "1" }); validate_store(dialogCountSpawn1Id1, 'dialogCountSpawn1Id1'); component_subscribe($$self, dialogCountSpawn1Id1, $$value => { $dialogCountSpawn1Id1 = $$value; $$invalidate('$dialogCountSpawn1Id1', $dialogCountSpawn1Id1); });

    	const click_handler = () => dialog$1.resetAll();

    	const click_handler_1 = () => dialog$1.resetAll({ id: "1" });

    	const click_handler_2 = () => dialog$1.resetAll({ spawn: "1" });

    	const click_handler_3 = () => dialog$1.resetAll({ id: "1", spawn: "1" });

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ('$dialogCount' in $$props) dialogCount.set($dialogCount);
    		if ('$dialogCountId1' in $$props) dialogCountId1.set($dialogCountId1);
    		if ('$dialogCountSpawn1' in $$props) dialogCountSpawn1.set($dialogCountSpawn1);
    		if ('$dialogCountSpawn1Id1' in $$props) dialogCountSpawn1Id1.set($dialogCountSpawn1Id1);
    	};

    	return {
    		fns1,
    		fns2,
    		fns3,
    		fns4,
    		dialogCount,
    		dialogCountId1,
    		dialogCountSpawn1,
    		dialogCountSpawn1Id1,
    		$dialogCount,
    		$dialogCountId1,
    		$dialogCountSpawn1,
    		$dialogCountSpawn1Id1,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3
    	};
    }

    class DialogResetAll extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$g, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "DialogResetAll", options, id: create_fragment$g.name });
    	}
    }

    /* src/cypress-tests/Remaining.svelte generated by Svelte v3.12.1 */

    const file$c = "src/cypress-tests/Remaining.svelte";

    function create_fragment$h(ctx) {
    	var div, span0, t1, span1, t2_value = ctx.displayValue === ctx.undefined
        ? "undefined"
        : ctx.displayValue.toString() + "", t2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span0 = element("span");
    			span0.textContent = "Remaining:";
    			t1 = space();
    			span1 = element("span");
    			t2 = text(t2_value);
    			add_location(span0, file$c, 24, 2, 474);
    			attr_dev(span1, "data-test-id", "remaining-value");
    			add_location(span1, file$c, 25, 2, 501);
    			attr_dev(div, "data-test-id", "remaining");
    			add_location(div, file$c, 23, 0, 441);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span0);
    			append_dev(div, t1);
    			append_dev(div, span1);
    			append_dev(span1, t2);
    		},

    		p: function update_1(changed, ctx) {
    			if ((changed.displayValue) && t2_value !== (t2_value = ctx.displayValue === ctx.undefined
        ? "undefined"
        : ctx.displayValue.toString() + "")) {
    				set_data_dev(t2, t2_value);
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$h.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
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

    	$$self.$capture_state = () => {
    		return { getRemainingFn, displayValue, reqId };
    	};

    	$$self.$inject_state = $$props => {
    		if ('getRemainingFn' in $$props) $$invalidate('getRemainingFn', getRemainingFn = $$props.getRemainingFn);
    		if ('displayValue' in $$props) $$invalidate('displayValue', displayValue = $$props.displayValue);
    		if ('reqId' in $$props) reqId = $$props.reqId;
    	};

    	return { getRemainingFn, displayValue, undefined };
    }

    class Remaining extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$h, safe_not_equal, ["getRemainingFn"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Remaining", options, id: create_fragment$h.name });

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

    /* src/cypress-tests/DialogTimeout.svelte generated by Svelte v3.12.1 */

    const file$d = "src/cypress-tests/DialogTimeout.svelte";

    function create_fragment$i(ctx) {
    	var div6, div1, div0, button0, t1, button1, t3, button2, t5, div2, t6_value = `Is paused: ${ctx.$dialogIsPaused}` + "", t6, t7, div3, t8, div4, t9, div5, current, dispose;

    	var remaining = new Remaining({
    		props: { getRemainingFn: dialog$1.getRemaining },
    		$$inline: true
    	});

    	var buttons_spread_levels = [
    		ctx.fns
    	];

    	let buttons_props = {};
    	for (var i = 0; i < buttons_spread_levels.length; i += 1) {
    		buttons_props = assign(buttons_props, buttons_spread_levels[i]);
    	}
    	var buttons = new Buttons({ props: buttons_props, $$inline: true });

    	var dialog_1 = new Dialog({ $$inline: true });

    	const block = {
    		c: function create() {
    			div6 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			button0 = element("button");
    			button0.textContent = "Pause";
    			t1 = space();
    			button1 = element("button");
    			button1.textContent = "Resume";
    			t3 = space();
    			button2 = element("button");
    			button2.textContent = "Reset";
    			t5 = space();
    			div2 = element("div");
    			t6 = text(t6_value);
    			t7 = space();
    			div3 = element("div");
    			remaining.$$.fragment.c();
    			t8 = space();
    			div4 = element("div");
    			buttons.$$.fragment.c();
    			t9 = space();
    			div5 = element("div");
    			dialog_1.$$.fragment.c();
    			attr_dev(button0, "class", "button");
    			attr_dev(button0, "data-test-id", "button-pause");
    			add_location(button0, file$d, 15, 6, 543);
    			attr_dev(button1, "class", "button");
    			attr_dev(button1, "data-test-id", "button-resume");
    			add_location(button1, file$d, 18, 6, 663);
    			attr_dev(button2, "class", "button");
    			attr_dev(button2, "data-test-id", "button-reset");
    			add_location(button2, file$d, 21, 6, 786);
    			attr_dev(div0, "class", "buttons");
    			add_location(div0, file$d, 14, 4, 515);
    			attr_dev(div1, "class", "control");
    			attr_dev(div1, "data-test-id", "reset-all");
    			add_location(div1, file$d, 13, 2, 464);
    			attr_dev(div2, "class", "control");
    			attr_dev(div2, "data-test-id", "is-paused");
    			add_location(div2, file$d, 26, 2, 925);
    			attr_dev(div3, "class", "control");
    			add_location(div3, file$d, 29, 2, 1021);
    			attr_dev(div4, "class", "content");
    			add_location(div4, file$d, 32, 2, 1109);
    			attr_dev(div5, "class", "spawn default-spawn");
    			add_location(div5, file$d, 35, 2, 1167);
    			attr_dev(div6, "class", "test");
    			add_location(div6, file$d, 12, 0, 443);

    			dispose = [
    				listen_dev(button0, "click", ctx.click_handler),
    				listen_dev(button1, "click", ctx.click_handler_1),
    				listen_dev(button2, "click", ctx.click_handler_2)
    			];
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div1);
    			append_dev(div1, div0);
    			append_dev(div0, button0);
    			append_dev(div0, t1);
    			append_dev(div0, button1);
    			append_dev(div0, t3);
    			append_dev(div0, button2);
    			append_dev(div6, t5);
    			append_dev(div6, div2);
    			append_dev(div2, t6);
    			append_dev(div6, t7);
    			append_dev(div6, div3);
    			mount_component(remaining, div3, null);
    			append_dev(div6, t8);
    			append_dev(div6, div4);
    			mount_component(buttons, div4, null);
    			append_dev(div6, t9);
    			append_dev(div6, div5);
    			mount_component(dialog_1, div5, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if ((!current || changed.$dialogIsPaused) && t6_value !== (t6_value = `Is paused: ${ctx.$dialogIsPaused}` + "")) {
    				set_data_dev(t6, t6_value);
    			}

    			var buttons_changes = (changed.fns) ? get_spread_update(buttons_spread_levels, [
    									get_spread_object(ctx.fns)
    								]) : {};
    			buttons.$set(buttons_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(remaining.$$.fragment, local);

    			transition_in(buttons.$$.fragment, local);

    			transition_in(dialog_1.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(remaining.$$.fragment, local);
    			transition_out(buttons.$$.fragment, local);
    			transition_out(dialog_1.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div6);
    			}

    			destroy_component(remaining);

    			destroy_component(buttons);

    			destroy_component(dialog_1);

    			run_all(dispose);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$i.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let $dialogIsPaused;

    	

      dialog$1.resetAll();
      const fns = createFns({ instance: dialog$1, component: Default, className: "dialog", title: "Default", timeout: 2000 });
      const dialogIsPaused = dialog$1.isPaused(); validate_store(dialogIsPaused, 'dialogIsPaused'); component_subscribe($$self, dialogIsPaused, $$value => { $dialogIsPaused = $$value; $$invalidate('$dialogIsPaused', $dialogIsPaused); });

    	const click_handler = () => dialog$1.pause();

    	const click_handler_1 = () => dialog$1.resume();

    	const click_handler_2 = () => dialog$1.resetAll();

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ('$dialogIsPaused' in $$props) dialogIsPaused.set($dialogIsPaused);
    	};

    	return {
    		fns,
    		dialogIsPaused,
    		$dialogIsPaused,
    		click_handler,
    		click_handler_1,
    		click_handler_2
    	};
    }

    class DialogTimeout extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$i, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "DialogTimeout", options, id: create_fragment$i.name });
    	}
    }

    /* src/cypress-tests/DialogQueued.svelte generated by Svelte v3.12.1 */

    const file$e = "src/cypress-tests/DialogQueued.svelte";

    function create_fragment$j(ctx) {
    	var div3, div0, t0_value = `Count all: ${ctx.$dialogCount}` + "", t0, t1, div1, t2, div2, current;

    	var buttons_spread_levels = [
    		ctx.fns
    	];

    	let buttons_props = {};
    	for (var i = 0; i < buttons_spread_levels.length; i += 1) {
    		buttons_props = assign(buttons_props, buttons_spread_levels[i]);
    	}
    	var buttons = new Buttons({ props: buttons_props, $$inline: true });

    	var dialog_1 = new Dialog({ $$inline: true });

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			div1 = element("div");
    			buttons.$$.fragment.c();
    			t2 = space();
    			div2 = element("div");
    			dialog_1.$$.fragment.c();
    			attr_dev(div0, "class", "control");
    			attr_dev(div0, "data-test-id", "count-all");
    			add_location(div0, file$e, 12, 2, 413);
    			attr_dev(div1, "class", "content");
    			add_location(div1, file$e, 13, 2, 498);
    			attr_dev(div2, "class", "spawn default-spawn");
    			add_location(div2, file$e, 16, 2, 556);
    			attr_dev(div3, "class", "test");
    			add_location(div3, file$e, 11, 0, 392);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div0, t0);
    			append_dev(div3, t1);
    			append_dev(div3, div1);
    			mount_component(buttons, div1, null);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			mount_component(dialog_1, div2, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if ((!current || changed.$dialogCount) && t0_value !== (t0_value = `Count all: ${ctx.$dialogCount}` + "")) {
    				set_data_dev(t0, t0_value);
    			}

    			var buttons_changes = (changed.fns) ? get_spread_update(buttons_spread_levels, [
    									get_spread_object(ctx.fns)
    								]) : {};
    			buttons.$set(buttons_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(buttons.$$.fragment, local);

    			transition_in(dialog_1.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(buttons.$$.fragment, local);
    			transition_out(dialog_1.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div3);
    			}

    			destroy_component(buttons);

    			destroy_component(dialog_1);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$j.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let $dialogCount;

    	

      dialog$1.resetAll();
      const fns = createFns({ instance: dialog$1, component: Default, className: "dialog", title: "Default", queued: true });
      const dialogCount = dialog$1.getCount(); validate_store(dialogCount, 'dialogCount'); component_subscribe($$self, dialogCount, $$value => { $dialogCount = $$value; $$invalidate('$dialogCount', $dialogCount); });

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ('$dialogCount' in $$props) dialogCount.set($dialogCount);
    	};

    	return { fns, dialogCount, $dialogCount };
    }

    class DialogQueued extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$j, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "DialogQueued", options, id: create_fragment$j.name });
    	}
    }

    /* src/cypress-tests/NotificationCount.svelte generated by Svelte v3.12.1 */

    const file$f = "src/cypress-tests/NotificationCount.svelte";

    function create_fragment$k(ctx) {
    	var div9, div0, t0_value = `Count all: ${ctx.$notificationCount}` + "", t0, t1, div1, t2_value = `Count id: ${ctx.$notificationCountId1}` + "", t2, t3, div2, t4_value = `Count spawn: ${ctx.$notificationCountSpawn1}` + "", t4, t5, div3, t6_value = `Count spawn, id: ${ctx.$notificationCountSpawn1Id1}` + "", t6, t7, div5, div4, button, t9, div6, t10, t11, t12, t13, div7, t14, div8, current, dispose;

    	var buttons0_spread_levels = [
    		ctx.fns1
    	];

    	let buttons0_props = {};
    	for (var i = 0; i < buttons0_spread_levels.length; i += 1) {
    		buttons0_props = assign(buttons0_props, buttons0_spread_levels[i]);
    	}
    	var buttons0 = new Buttons({ props: buttons0_props, $$inline: true });

    	var buttons1_spread_levels = [
    		ctx.fns2,
    		{ id: "1" }
    	];

    	let buttons1_props = {};
    	for (var i = 0; i < buttons1_spread_levels.length; i += 1) {
    		buttons1_props = assign(buttons1_props, buttons1_spread_levels[i]);
    	}
    	var buttons1 = new Buttons({ props: buttons1_props, $$inline: true });

    	var buttons2_spread_levels = [
    		ctx.fns3,
    		{ spawn: "1" }
    	];

    	let buttons2_props = {};
    	for (var i = 0; i < buttons2_spread_levels.length; i += 1) {
    		buttons2_props = assign(buttons2_props, buttons2_spread_levels[i]);
    	}
    	var buttons2 = new Buttons({ props: buttons2_props, $$inline: true });

    	var buttons3_spread_levels = [
    		ctx.fns4,
    		{ spawn: "1" },
    		{ id: "1" }
    	];

    	let buttons3_props = {};
    	for (var i = 0; i < buttons3_spread_levels.length; i += 1) {
    		buttons3_props = assign(buttons3_props, buttons3_spread_levels[i]);
    	}
    	var buttons3 = new Buttons({ props: buttons3_props, $$inline: true });

    	var notification0 = new Notification({ $$inline: true });

    	var notification1 = new Notification({ props: { spawn: "1" }, $$inline: true });

    	const block = {
    		c: function create() {
    			div9 = element("div");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			div1 = element("div");
    			t2 = text(t2_value);
    			t3 = space();
    			div2 = element("div");
    			t4 = text(t4_value);
    			t5 = space();
    			div3 = element("div");
    			t6 = text(t6_value);
    			t7 = space();
    			div5 = element("div");
    			div4 = element("div");
    			button = element("button");
    			button.textContent = "Reset";
    			t9 = space();
    			div6 = element("div");
    			buttons0.$$.fragment.c();
    			t10 = space();
    			buttons1.$$.fragment.c();
    			t11 = space();
    			buttons2.$$.fragment.c();
    			t12 = space();
    			buttons3.$$.fragment.c();
    			t13 = space();
    			div7 = element("div");
    			notification0.$$.fragment.c();
    			t14 = space();
    			div8 = element("div");
    			notification1.$$.fragment.c();
    			attr_dev(div0, "class", "control");
    			attr_dev(div0, "data-test-id", "count-all");
    			add_location(div0, file$f, 17, 2, 1038);
    			attr_dev(div1, "class", "control");
    			attr_dev(div1, "data-test-id", "count-id");
    			add_location(div1, file$f, 18, 2, 1129);
    			attr_dev(div2, "class", "control");
    			attr_dev(div2, "data-test-id", "count-spawn");
    			add_location(div2, file$f, 19, 2, 1221);
    			attr_dev(div3, "class", "control");
    			attr_dev(div3, "data-test-id", "count-spawn-id");
    			add_location(div3, file$f, 20, 2, 1322);
    			attr_dev(button, "class", "button");
    			attr_dev(button, "data-test-id", "button-reset");
    			add_location(button, file$f, 23, 6, 1487);
    			attr_dev(div4, "class", "buttons");
    			add_location(div4, file$f, 22, 4, 1459);
    			attr_dev(div5, "class", "control");
    			add_location(div5, file$f, 21, 2, 1433);
    			attr_dev(div6, "class", "content");
    			add_location(div6, file$f, 28, 2, 1632);
    			attr_dev(div7, "class", "spawn default-spawn");
    			add_location(div7, file$f, 34, 2, 1803);
    			attr_dev(div8, "class", "spawn custom-spawn");
    			add_location(div8, file$f, 37, 2, 1869);
    			attr_dev(div9, "class", "test");
    			add_location(div9, file$f, 16, 0, 1017);
    			dispose = listen_dev(button, "click", ctx.click_handler);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div9, anchor);
    			append_dev(div9, div0);
    			append_dev(div0, t0);
    			append_dev(div9, t1);
    			append_dev(div9, div1);
    			append_dev(div1, t2);
    			append_dev(div9, t3);
    			append_dev(div9, div2);
    			append_dev(div2, t4);
    			append_dev(div9, t5);
    			append_dev(div9, div3);
    			append_dev(div3, t6);
    			append_dev(div9, t7);
    			append_dev(div9, div5);
    			append_dev(div5, div4);
    			append_dev(div4, button);
    			append_dev(div9, t9);
    			append_dev(div9, div6);
    			mount_component(buttons0, div6, null);
    			append_dev(div6, t10);
    			mount_component(buttons1, div6, null);
    			append_dev(div6, t11);
    			mount_component(buttons2, div6, null);
    			append_dev(div6, t12);
    			mount_component(buttons3, div6, null);
    			append_dev(div9, t13);
    			append_dev(div9, div7);
    			mount_component(notification0, div7, null);
    			append_dev(div9, t14);
    			append_dev(div9, div8);
    			mount_component(notification1, div8, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if ((!current || changed.$notificationCount) && t0_value !== (t0_value = `Count all: ${ctx.$notificationCount}` + "")) {
    				set_data_dev(t0, t0_value);
    			}

    			if ((!current || changed.$notificationCountId1) && t2_value !== (t2_value = `Count id: ${ctx.$notificationCountId1}` + "")) {
    				set_data_dev(t2, t2_value);
    			}

    			if ((!current || changed.$notificationCountSpawn1) && t4_value !== (t4_value = `Count spawn: ${ctx.$notificationCountSpawn1}` + "")) {
    				set_data_dev(t4, t4_value);
    			}

    			if ((!current || changed.$notificationCountSpawn1Id1) && t6_value !== (t6_value = `Count spawn, id: ${ctx.$notificationCountSpawn1Id1}` + "")) {
    				set_data_dev(t6, t6_value);
    			}

    			var buttons0_changes = (changed.fns1) ? get_spread_update(buttons0_spread_levels, [
    									get_spread_object(ctx.fns1)
    								]) : {};
    			buttons0.$set(buttons0_changes);

    			var buttons1_changes = (changed.fns2) ? get_spread_update(buttons1_spread_levels, [
    									get_spread_object(ctx.fns2),
    			buttons1_spread_levels[1]
    								]) : {};
    			buttons1.$set(buttons1_changes);

    			var buttons2_changes = (changed.fns3) ? get_spread_update(buttons2_spread_levels, [
    									get_spread_object(ctx.fns3),
    			buttons2_spread_levels[1]
    								]) : {};
    			buttons2.$set(buttons2_changes);

    			var buttons3_changes = (changed.fns4) ? get_spread_update(buttons3_spread_levels, [
    									get_spread_object(ctx.fns4),
    			buttons3_spread_levels[1],
    			buttons3_spread_levels[2]
    								]) : {};
    			buttons3.$set(buttons3_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(buttons0.$$.fragment, local);

    			transition_in(buttons1.$$.fragment, local);

    			transition_in(buttons2.$$.fragment, local);

    			transition_in(buttons3.$$.fragment, local);

    			transition_in(notification0.$$.fragment, local);

    			transition_in(notification1.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(buttons0.$$.fragment, local);
    			transition_out(buttons1.$$.fragment, local);
    			transition_out(buttons2.$$.fragment, local);
    			transition_out(buttons3.$$.fragment, local);
    			transition_out(notification0.$$.fragment, local);
    			transition_out(notification1.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div9);
    			}

    			destroy_component(buttons0);

    			destroy_component(buttons1);

    			destroy_component(buttons2);

    			destroy_component(buttons3);

    			destroy_component(notification0);

    			destroy_component(notification1);

    			dispose();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$k.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let $notificationCount, $notificationCountId1, $notificationCountSpawn1, $notificationCountSpawn1Id1;

    	

      const fns1 = createFns({ instance: notification$1, component: Default, className: "notification", title: "Default" });
      const fns2 = createFns({ instance: notification$1, component: Default, className: "notification", id: "1", title: "ID" });
      const fns3 = createFns({ instance: notification$1, component: Default, className: "notification", spawn: "1", title: "Spawn" });
      const fns4 = createFns({ instance: notification$1, component: Default, className: "notification", spawn: "1", id: "1", title: "Spawn and ID" });
      const notificationCount = notification$1.getCount(); validate_store(notificationCount, 'notificationCount'); component_subscribe($$self, notificationCount, $$value => { $notificationCount = $$value; $$invalidate('$notificationCount', $notificationCount); });
      const notificationCountId1 = notification$1.getCount({ id: "1" }); validate_store(notificationCountId1, 'notificationCountId1'); component_subscribe($$self, notificationCountId1, $$value => { $notificationCountId1 = $$value; $$invalidate('$notificationCountId1', $notificationCountId1); });
      const notificationCountSpawn1 = notification$1.getCount({ spawn: "1" }); validate_store(notificationCountSpawn1, 'notificationCountSpawn1'); component_subscribe($$self, notificationCountSpawn1, $$value => { $notificationCountSpawn1 = $$value; $$invalidate('$notificationCountSpawn1', $notificationCountSpawn1); });
      const notificationCountSpawn1Id1 = notification$1.getCount({ spawn: "1", id: "1" }); validate_store(notificationCountSpawn1Id1, 'notificationCountSpawn1Id1'); component_subscribe($$self, notificationCountSpawn1Id1, $$value => { $notificationCountSpawn1Id1 = $$value; $$invalidate('$notificationCountSpawn1Id1', $notificationCountSpawn1Id1); });

    	const click_handler = () => notification$1.resetAll();

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ('$notificationCount' in $$props) notificationCount.set($notificationCount);
    		if ('$notificationCountId1' in $$props) notificationCountId1.set($notificationCountId1);
    		if ('$notificationCountSpawn1' in $$props) notificationCountSpawn1.set($notificationCountSpawn1);
    		if ('$notificationCountSpawn1Id1' in $$props) notificationCountSpawn1Id1.set($notificationCountSpawn1Id1);
    	};

    	return {
    		fns1,
    		fns2,
    		fns3,
    		fns4,
    		notificationCount,
    		notificationCountId1,
    		notificationCountSpawn1,
    		notificationCountSpawn1Id1,
    		$notificationCount,
    		$notificationCountId1,
    		$notificationCountSpawn1,
    		$notificationCountSpawn1Id1,
    		click_handler
    	};
    }

    class NotificationCount extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$k, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "NotificationCount", options, id: create_fragment$k.name });
    	}
    }

    /* src/cypress-tests/NotificationPause.svelte generated by Svelte v3.12.1 */

    const file$g = "src/cypress-tests/NotificationPause.svelte";

    function create_fragment$l(ctx) {
    	var div6, div1, div0, button0, t1, button1, t3, button2, t5, div2, t6_value = `Is paused: ${ctx.$notificationIsPaused}` + "", t6, t7, div3, t8, div4, t9, div5, current, dispose;

    	var remaining = new Remaining({
    		props: { getRemainingFn: notification$1.getRemaining },
    		$$inline: true
    	});

    	var buttons_spread_levels = [
    		ctx.fns
    	];

    	let buttons_props = {};
    	for (var i = 0; i < buttons_spread_levels.length; i += 1) {
    		buttons_props = assign(buttons_props, buttons_spread_levels[i]);
    	}
    	var buttons = new Buttons({ props: buttons_props, $$inline: true });

    	var notification_1 = new Notification({ $$inline: true });

    	const block = {
    		c: function create() {
    			div6 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			button0 = element("button");
    			button0.textContent = "Pause";
    			t1 = space();
    			button1 = element("button");
    			button1.textContent = "Resume";
    			t3 = space();
    			button2 = element("button");
    			button2.textContent = "Reset";
    			t5 = space();
    			div2 = element("div");
    			t6 = text(t6_value);
    			t7 = space();
    			div3 = element("div");
    			remaining.$$.fragment.c();
    			t8 = space();
    			div4 = element("div");
    			buttons.$$.fragment.c();
    			t9 = space();
    			div5 = element("div");
    			notification_1.$$.fragment.c();
    			attr_dev(button0, "class", "button");
    			attr_dev(button0, "data-test-id", "button-pause");
    			add_location(button0, file$g, 15, 6, 585);
    			attr_dev(button1, "class", "button");
    			attr_dev(button1, "data-test-id", "button-resume");
    			add_location(button1, file$g, 18, 6, 711);
    			attr_dev(button2, "class", "button");
    			attr_dev(button2, "data-test-id", "button-reset");
    			add_location(button2, file$g, 21, 6, 840);
    			attr_dev(div0, "class", "buttons");
    			add_location(div0, file$g, 14, 4, 557);
    			attr_dev(div1, "class", "control");
    			attr_dev(div1, "data-test-id", "reset-all");
    			add_location(div1, file$g, 13, 2, 506);
    			attr_dev(div2, "class", "control");
    			attr_dev(div2, "data-test-id", "is-paused");
    			add_location(div2, file$g, 26, 2, 985);
    			attr_dev(div3, "class", "control");
    			add_location(div3, file$g, 29, 2, 1087);
    			attr_dev(div4, "class", "content");
    			add_location(div4, file$g, 32, 2, 1181);
    			attr_dev(div5, "class", "spawn default-spawn");
    			add_location(div5, file$g, 35, 2, 1239);
    			attr_dev(div6, "class", "test");
    			add_location(div6, file$g, 12, 0, 485);

    			dispose = [
    				listen_dev(button0, "click", ctx.click_handler),
    				listen_dev(button1, "click", ctx.click_handler_1),
    				listen_dev(button2, "click", ctx.click_handler_2)
    			];
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div1);
    			append_dev(div1, div0);
    			append_dev(div0, button0);
    			append_dev(div0, t1);
    			append_dev(div0, button1);
    			append_dev(div0, t3);
    			append_dev(div0, button2);
    			append_dev(div6, t5);
    			append_dev(div6, div2);
    			append_dev(div2, t6);
    			append_dev(div6, t7);
    			append_dev(div6, div3);
    			mount_component(remaining, div3, null);
    			append_dev(div6, t8);
    			append_dev(div6, div4);
    			mount_component(buttons, div4, null);
    			append_dev(div6, t9);
    			append_dev(div6, div5);
    			mount_component(notification_1, div5, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if ((!current || changed.$notificationIsPaused) && t6_value !== (t6_value = `Is paused: ${ctx.$notificationIsPaused}` + "")) {
    				set_data_dev(t6, t6_value);
    			}

    			var buttons_changes = (changed.fns) ? get_spread_update(buttons_spread_levels, [
    									get_spread_object(ctx.fns)
    								]) : {};
    			buttons.$set(buttons_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(remaining.$$.fragment, local);

    			transition_in(buttons.$$.fragment, local);

    			transition_in(notification_1.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(remaining.$$.fragment, local);
    			transition_out(buttons.$$.fragment, local);
    			transition_out(notification_1.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div6);
    			}

    			destroy_component(remaining);

    			destroy_component(buttons);

    			destroy_component(notification_1);

    			run_all(dispose);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$l.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let $notificationIsPaused;

    	

      notification$1.resetAll();
      const fns = createFns({ instance: notification$1, component: Default, className: "notification", title: "Default", timeout: 2000 });
      const notificationIsPaused = notification$1.isPaused(); validate_store(notificationIsPaused, 'notificationIsPaused'); component_subscribe($$self, notificationIsPaused, $$value => { $notificationIsPaused = $$value; $$invalidate('$notificationIsPaused', $notificationIsPaused); });

    	const click_handler = () => notification$1.pause();

    	const click_handler_1 = () => notification$1.resume();

    	const click_handler_2 = () => notification$1.resetAll();

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ('$notificationIsPaused' in $$props) notificationIsPaused.set($notificationIsPaused);
    	};

    	return {
    		fns,
    		notificationIsPaused,
    		$notificationIsPaused,
    		click_handler,
    		click_handler_1,
    		click_handler_2
    	};
    }

    class NotificationPause extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$l, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "NotificationPause", options, id: create_fragment$l.name });
    	}
    }

    /* src/cypress-tests/NotificationTimeout.svelte generated by Svelte v3.12.1 */

    const file$h = "src/cypress-tests/NotificationTimeout.svelte";

    function create_fragment$m(ctx) {
    	var div6, div1, div0, button0, t1, button1, t3, button2, t5, div2, t6_value = `Is paused: ${ctx.$notificationIsPaused}` + "", t6, t7, div3, t8, div4, t9, t10, div5, current, dispose;

    	var remaining = new Remaining({
    		props: { getRemainingFn: notification$1.getRemaining },
    		$$inline: true
    	});

    	var buttons0_spread_levels = [
    		ctx.fns1
    	];

    	let buttons0_props = {};
    	for (var i = 0; i < buttons0_spread_levels.length; i += 1) {
    		buttons0_props = assign(buttons0_props, buttons0_spread_levels[i]);
    	}
    	var buttons0 = new Buttons({ props: buttons0_props, $$inline: true });

    	var buttons1_spread_levels = [
    		ctx.fns2,
    		{ id: "1" },
    		{ name: "zero-timeout" }
    	];

    	let buttons1_props = {};
    	for (var i = 0; i < buttons1_spread_levels.length; i += 1) {
    		buttons1_props = assign(buttons1_props, buttons1_spread_levels[i]);
    	}
    	var buttons1 = new Buttons({ props: buttons1_props, $$inline: true });

    	var notification_1 = new Notification({ $$inline: true });

    	const block = {
    		c: function create() {
    			div6 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			button0 = element("button");
    			button0.textContent = "Pause";
    			t1 = space();
    			button1 = element("button");
    			button1.textContent = "Resume";
    			t3 = space();
    			button2 = element("button");
    			button2.textContent = "Reset";
    			t5 = space();
    			div2 = element("div");
    			t6 = text(t6_value);
    			t7 = space();
    			div3 = element("div");
    			remaining.$$.fragment.c();
    			t8 = space();
    			div4 = element("div");
    			buttons0.$$.fragment.c();
    			t9 = space();
    			buttons1.$$.fragment.c();
    			t10 = space();
    			div5 = element("div");
    			notification_1.$$.fragment.c();
    			attr_dev(button0, "class", "button");
    			attr_dev(button0, "data-test-id", "button-pause");
    			add_location(button0, file$h, 16, 6, 720);
    			attr_dev(button1, "class", "button");
    			attr_dev(button1, "data-test-id", "button-resume");
    			add_location(button1, file$h, 19, 6, 846);
    			attr_dev(button2, "class", "button");
    			attr_dev(button2, "data-test-id", "button-reset");
    			add_location(button2, file$h, 22, 6, 975);
    			attr_dev(div0, "class", "buttons");
    			add_location(div0, file$h, 15, 4, 692);
    			attr_dev(div1, "class", "control");
    			attr_dev(div1, "data-test-id", "reset-all");
    			add_location(div1, file$h, 14, 2, 641);
    			attr_dev(div2, "class", "control");
    			attr_dev(div2, "data-test-id", "is-paused");
    			add_location(div2, file$h, 27, 2, 1120);
    			attr_dev(div3, "class", "control");
    			add_location(div3, file$h, 30, 2, 1222);
    			attr_dev(div4, "class", "content");
    			add_location(div4, file$h, 33, 2, 1316);
    			attr_dev(div5, "class", "spawn default-spawn");
    			add_location(div5, file$h, 37, 2, 1428);
    			attr_dev(div6, "class", "test");
    			add_location(div6, file$h, 13, 0, 620);

    			dispose = [
    				listen_dev(button0, "click", ctx.click_handler),
    				listen_dev(button1, "click", ctx.click_handler_1),
    				listen_dev(button2, "click", ctx.click_handler_2)
    			];
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div1);
    			append_dev(div1, div0);
    			append_dev(div0, button0);
    			append_dev(div0, t1);
    			append_dev(div0, button1);
    			append_dev(div0, t3);
    			append_dev(div0, button2);
    			append_dev(div6, t5);
    			append_dev(div6, div2);
    			append_dev(div2, t6);
    			append_dev(div6, t7);
    			append_dev(div6, div3);
    			mount_component(remaining, div3, null);
    			append_dev(div6, t8);
    			append_dev(div6, div4);
    			mount_component(buttons0, div4, null);
    			append_dev(div4, t9);
    			mount_component(buttons1, div4, null);
    			append_dev(div6, t10);
    			append_dev(div6, div5);
    			mount_component(notification_1, div5, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if ((!current || changed.$notificationIsPaused) && t6_value !== (t6_value = `Is paused: ${ctx.$notificationIsPaused}` + "")) {
    				set_data_dev(t6, t6_value);
    			}

    			var buttons0_changes = (changed.fns1) ? get_spread_update(buttons0_spread_levels, [
    									get_spread_object(ctx.fns1)
    								]) : {};
    			buttons0.$set(buttons0_changes);

    			var buttons1_changes = (changed.fns2) ? get_spread_update(buttons1_spread_levels, [
    									get_spread_object(ctx.fns2),
    			buttons1_spread_levels[1],
    			buttons1_spread_levels[2]
    								]) : {};
    			buttons1.$set(buttons1_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(remaining.$$.fragment, local);

    			transition_in(buttons0.$$.fragment, local);

    			transition_in(buttons1.$$.fragment, local);

    			transition_in(notification_1.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(remaining.$$.fragment, local);
    			transition_out(buttons0.$$.fragment, local);
    			transition_out(buttons1.$$.fragment, local);
    			transition_out(notification_1.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div6);
    			}

    			destroy_component(remaining);

    			destroy_component(buttons0);

    			destroy_component(buttons1);

    			destroy_component(notification_1);

    			run_all(dispose);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$m.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let $notificationIsPaused;

    	

      notification$1.resetAll();
      const fns1 = createFns({ instance: notification$1, component: Default, className: "notification", title: "Default", timeout: 2000 });
      const fns2 = createFns({ instance: notification$1, component: Default, className: "notification", title: "Timeout: 0", timeout: 0 });
      const notificationIsPaused = notification$1.isPaused(); validate_store(notificationIsPaused, 'notificationIsPaused'); component_subscribe($$self, notificationIsPaused, $$value => { $notificationIsPaused = $$value; $$invalidate('$notificationIsPaused', $notificationIsPaused); });

    	const click_handler = () => notification$1.pause();

    	const click_handler_1 = () => notification$1.resume();

    	const click_handler_2 = () => notification$1.resetAll();

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ('$notificationIsPaused' in $$props) notificationIsPaused.set($notificationIsPaused);
    	};

    	return {
    		fns1,
    		fns2,
    		notificationIsPaused,
    		$notificationIsPaused,
    		click_handler,
    		click_handler_1,
    		click_handler_2
    	};
    }

    class NotificationTimeout extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$m, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "NotificationTimeout", options, id: create_fragment$m.name });
    	}
    }

    /* src/cypress-tests/lib-bulma/DemoContent.svelte generated by Svelte v3.12.1 */

    const file$i = "src/cypress-tests/lib-bulma/DemoContent.svelte";

    function create_fragment$n(ctx) {
    	var article, div0, figure, img, t0, div3, div1, p, strong, t2, small0, t4, small1, t6, br, t7, t8, nav, div2, a0, span0, svg0, path0, t9, a1, span1, svg1, path1;

    	const block = {
    		c: function create() {
    			article = element("article");
    			div0 = element("div");
    			figure = element("figure");
    			img = element("img");
    			t0 = space();
    			div3 = element("div");
    			div1 = element("div");
    			p = element("p");
    			strong = element("strong");
    			strong.textContent = "John Smith";
    			t2 = space();
    			small0 = element("small");
    			small0.textContent = "@johnsmith";
    			t4 = space();
    			small1 = element("small");
    			small1.textContent = "31m";
    			t6 = space();
    			br = element("br");
    			t7 = text("\n        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean efficitur sit amet massa fringilla egestas. Nullam condimentum luctus turpis.");
    			t8 = space();
    			nav = element("nav");
    			div2 = element("div");
    			a0 = element("a");
    			span0 = element("span");
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			t9 = space();
    			a1 = element("a");
    			span1 = element("span");
    			svg1 = svg_element("svg");
    			path1 = svg_element("path");
    			attr_dev(img, "src", "https://bulma.io/images/placeholders/128x128.png");
    			attr_dev(img, "alt", "Image");
    			add_location(img, file$i, 3, 6, 93);
    			attr_dev(figure, "class", "image is-64x64");
    			add_location(figure, file$i, 2, 4, 55);
    			attr_dev(div0, "class", "media-left");
    			add_location(div0, file$i, 1, 2, 26);
    			add_location(strong, file$i, 9, 8, 265);
    			add_location(small0, file$i, 9, 36, 293);
    			add_location(small1, file$i, 9, 62, 319);
    			add_location(br, file$i, 10, 8, 346);
    			add_location(p, file$i, 8, 6, 253);
    			attr_dev(div1, "class", "content");
    			add_location(div1, file$i, 7, 4, 225);
    			attr_dev(path0, "fill", "currentColor");
    			attr_dev(path0, "d", "M629.657 343.598L528.971 444.284c-9.373 9.372-24.568 9.372-33.941 0L394.343 343.598c-9.373-9.373-9.373-24.569 0-33.941l10.823-10.823c9.562-9.562 25.133-9.34 34.419.492L480 342.118V160H292.451a24.005 24.005 0 0 1-16.971-7.029l-16-16C244.361 121.851 255.069 96 276.451 96H520c13.255 0 24 10.745 24 24v222.118l40.416-42.792c9.285-9.831 24.856-10.054 34.419-.492l10.823 10.823c9.372 9.372 9.372 24.569-.001 33.941zm-265.138 15.431A23.999 23.999 0 0 0 347.548 352H160V169.881l40.416 42.792c9.286 9.831 24.856 10.054 34.419.491l10.822-10.822c9.373-9.373 9.373-24.569 0-33.941L144.971 67.716c-9.373-9.373-24.569-9.373-33.941 0L10.343 168.402c-9.373 9.373-9.373 24.569 0 33.941l10.822 10.822c9.562 9.562 25.133 9.34 34.419-.491L96 169.881V392c0 13.255 10.745 24 24 24h243.549c21.382 0 32.09-25.851 16.971-40.971l-16.001-16z");
    			add_location(path0, file$i, 18, 201, 894);
    			attr_dev(svg0, "class", "svg-inline--fa fa-retweet fa-w-20");
    			attr_dev(svg0, "aria-hidden", "true");
    			attr_dev(svg0, "data-prefix", "fas");
    			attr_dev(svg0, "data-icon", "retweet");
    			attr_dev(svg0, "role", "img");
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "viewBox", "0 0 640 512");
    			attr_dev(svg0, "data-fa-i2svg", "");
    			add_location(svg0, file$i, 18, 12, 705);
    			attr_dev(span0, "class", "icon is-small");
    			add_location(span0, file$i, 17, 10, 664);
    			attr_dev(a0, "class", "level-item");
    			attr_dev(a0, "aria-label", "retweet");
    			attr_dev(a0, "href", null);
    			add_location(a0, file$i, 16, 8, 598);
    			attr_dev(path1, "fill", "currentColor");
    			attr_dev(path1, "d", "M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z");
    			add_location(path1, file$i, 23, 197, 2082);
    			attr_dev(svg1, "class", "svg-inline--fa fa-heart fa-w-16");
    			attr_dev(svg1, "aria-hidden", "true");
    			attr_dev(svg1, "data-prefix", "fas");
    			attr_dev(svg1, "data-icon", "heart");
    			attr_dev(svg1, "role", "img");
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "viewBox", "0 0 512 512");
    			attr_dev(svg1, "data-fa-i2svg", "");
    			add_location(svg1, file$i, 23, 12, 1897);
    			attr_dev(span1, "class", "icon is-small");
    			add_location(span1, file$i, 22, 10, 1856);
    			attr_dev(a1, "class", "level-item");
    			attr_dev(a1, "aria-label", "like");
    			attr_dev(a1, "href", null);
    			add_location(a1, file$i, 21, 8, 1793);
    			attr_dev(div2, "class", "level-left");
    			add_location(div2, file$i, 15, 6, 565);
    			attr_dev(nav, "class", "level is-mobile");
    			add_location(nav, file$i, 14, 4, 529);
    			attr_dev(div3, "class", "media-content");
    			add_location(div3, file$i, 6, 2, 193);
    			attr_dev(article, "class", "media");
    			add_location(article, file$i, 0, 0, 0);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, article, anchor);
    			append_dev(article, div0);
    			append_dev(div0, figure);
    			append_dev(figure, img);
    			append_dev(article, t0);
    			append_dev(article, div3);
    			append_dev(div3, div1);
    			append_dev(div1, p);
    			append_dev(p, strong);
    			append_dev(p, t2);
    			append_dev(p, small0);
    			append_dev(p, t4);
    			append_dev(p, small1);
    			append_dev(p, t6);
    			append_dev(p, br);
    			append_dev(p, t7);
    			append_dev(div3, t8);
    			append_dev(div3, nav);
    			append_dev(nav, div2);
    			append_dev(div2, a0);
    			append_dev(a0, span0);
    			append_dev(span0, svg0);
    			append_dev(svg0, path0);
    			append_dev(div2, t9);
    			append_dev(div2, a1);
    			append_dev(a1, span1);
    			append_dev(span1, svg1);
    			append_dev(svg1, path1);
    		},

    		p: noop,
    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(article);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$n.name, type: "component", source: "", ctx });
    	return block;
    }

    class DemoContent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$n, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "DemoContent", options, id: create_fragment$n.name });
    	}
    }

    /* src/cypress-tests/lib-bulma/DialogComponent.svelte generated by Svelte v3.12.1 */

    const file$j = "src/cypress-tests/lib-bulma/DialogComponent.svelte";

    function create_fragment$o(ctx) {
    	var div3, div0, t0, div2, div1, t1, button, current, dispose;

    	var democontent = new DemoContent({ $$inline: true });

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div2 = element("div");
    			div1 = element("div");
    			democontent.$$.fragment.c();
    			t1 = space();
    			button = element("button");
    			attr_dev(div0, "class", "modal-background");
    			add_location(div0, file$j, 10, 2, 205);
    			attr_dev(div1, "class", "bulma-dialog-content-box");
    			add_location(div1, file$j, 12, 4, 319);
    			attr_dev(div2, "class", "modal-content");
    			add_location(div2, file$j, 11, 2, 287);
    			attr_dev(button, "class", "modal-close is-large");
    			attr_dev(button, "aria-label", "close");
    			add_location(button, file$j, 16, 2, 402);
    			attr_dev(div3, "class", "modal is-active");
    			add_location(div3, file$j, 9, 0, 173);

    			dispose = [
    				listen_dev(div0, "click", ctx.click_handler),
    				listen_dev(button, "click", ctx.click_handler_1)
    			];
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div3, t0);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			mount_component(democontent, div1, null);
    			append_dev(div3, t1);
    			append_dev(div3, button);
    			current = true;
    		},

    		p: noop,

    		i: function intro(local) {
    			if (current) return;
    			transition_in(democontent.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(democontent.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div3);
    			}

    			destroy_component(democontent);

    			run_all(dispose);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$o.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	

    let { isModal = false, show, hide } = $$props;

    	const writable_props = ['isModal', 'show', 'hide'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<DialogComponent> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => !isModal && dialog$1.hide();

    	const click_handler_1 = () => dialog$1.hide();

    	$$self.$set = $$props => {
    		if ('isModal' in $$props) $$invalidate('isModal', isModal = $$props.isModal);
    		if ('show' in $$props) $$invalidate('show', show = $$props.show);
    		if ('hide' in $$props) $$invalidate('hide', hide = $$props.hide);
    	};

    	$$self.$capture_state = () => {
    		return { isModal, show, hide };
    	};

    	$$self.$inject_state = $$props => {
    		if ('isModal' in $$props) $$invalidate('isModal', isModal = $$props.isModal);
    		if ('show' in $$props) $$invalidate('show', show = $$props.show);
    		if ('hide' in $$props) $$invalidate('hide', hide = $$props.hide);
    	};

    	return {
    		isModal,
    		show,
    		hide,
    		click_handler,
    		click_handler_1
    	};
    }

    class DialogComponent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$o, safe_not_equal, ["isModal", "show", "hide"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "DialogComponent", options, id: create_fragment$o.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.show === undefined && !('show' in props)) {
    			console.warn("<DialogComponent> was created without expected prop 'show'");
    		}
    		if (ctx.hide === undefined && !('hide' in props)) {
    			console.warn("<DialogComponent> was created without expected prop 'hide'");
    		}
    	}

    	get isModal() {
    		throw new Error("<DialogComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isModal(value) {
    		throw new Error("<DialogComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get show() {
    		throw new Error("<DialogComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set show(value) {
    		throw new Error("<DialogComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hide() {
    		throw new Error("<DialogComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hide(value) {
    		throw new Error("<DialogComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/cypress-tests/lib-bulma/Dialog.svelte generated by Svelte v3.12.1 */

    const file$k = "src/cypress-tests/lib-bulma/Dialog.svelte";

    function create_fragment$p(ctx) {
    	var div3, div1, div0, button0, t1, button1, t3, div2, current, dispose;

    	var dialog_1 = new Dialog({ $$inline: true });

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			button0 = element("button");
    			button0.textContent = "Show dialog";
    			t1 = space();
    			button1 = element("button");
    			button1.textContent = "Show modal dialog";
    			t3 = space();
    			div2 = element("div");
    			dialog_1.$$.fragment.c();
    			attr_dev(button0, "class", "button");
    			add_location(button0, file$k, 8, 6, 225);
    			attr_dev(button1, "class", "button");
    			add_location(button1, file$k, 19, 6, 463);
    			attr_dev(div0, "class", "buttons");
    			add_location(div0, file$k, 7, 4, 197);
    			attr_dev(div1, "class", "control");
    			attr_dev(div1, "data-test-id", "hide-all");
    			add_location(div1, file$k, 6, 2, 147);
    			attr_dev(div2, "class", "bulma");
    			add_location(div2, file$k, 33, 2, 749);
    			attr_dev(div3, "class", "test");
    			add_location(div3, file$k, 5, 0, 126);

    			dispose = [
    				listen_dev(button0, "click", ctx.click_handler),
    				listen_dev(button1, "click", ctx.click_handler_1)
    			];
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div1);
    			append_dev(div1, div0);
    			append_dev(div0, button0);
    			append_dev(div0, t1);
    			append_dev(div0, button1);
    			append_dev(div3, t3);
    			append_dev(div3, div2);
    			mount_component(dialog_1, div2, null);
    			current = true;
    		},

    		p: noop,

    		i: function intro(local) {
    			if (current) return;
    			transition_in(dialog_1.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(dialog_1.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div3);
    			}

    			destroy_component(dialog_1);

    			run_all(dispose);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$p.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$m($$self) {
    	const click_handler = () => dialog$1.show({
    	          dialogic: {
    	            component: DialogComponent,
    	            className: "dialog",
    	          }
    	        });

    	const click_handler_1 = () => dialog$1.show({
    	          dialogic: {
    	            component: DialogComponent,
    	            className: "dialog",
    	          },
    	          isModal: true,
    	        });

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {};

    	return { click_handler, click_handler_1 };
    }

    class Dialog_1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$m, create_fragment$p, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Dialog_1", options, id: create_fragment$p.name });
    	}
    }

    /* src/cypress-tests/lib-material-io/DemoContent.svelte generated by Svelte v3.12.1 */

    const file$l = "src/cypress-tests/lib-material-io/DemoContent.svelte";

    function create_fragment$q(ctx) {
    	var div2, div1, h2, t1, div0, t3, footer, button0, span0, t5, button1, span1, dispose;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Dialog Title";
    			t1 = space();
    			div0 = element("div");
    			div0.textContent = "Dialog body text goes here.";
    			t3 = space();
    			footer = element("footer");
    			button0 = element("button");
    			span0 = element("span");
    			span0.textContent = "No";
    			t5 = space();
    			button1 = element("button");
    			span1 = element("span");
    			span1.textContent = "Yes";
    			attr_dev(h2, "class", "mdc-dialog__title");
    			attr_dev(h2, "id", "my-dialog-title");
    			add_location(h2, file$l, 6, 4, 138);
    			attr_dev(div0, "class", "mdc-dialog__content");
    			attr_dev(div0, "id", "my-dialog-content");
    			add_location(div0, file$l, 7, 4, 211);
    			attr_dev(span0, "class", "mdc-button__label");
    			add_location(span0, file$l, 17, 8, 527);
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "mdc-button mdc-dialog__button");
    			attr_dev(button0, "data-mdc-dialog-action", "no");
    			add_location(button0, file$l, 11, 6, 360);
    			attr_dev(span1, "class", "mdc-button__label");
    			add_location(span1, file$l, 25, 8, 759);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "mdc-button mdc-dialog__button");
    			attr_dev(button1, "data-mdc-dialog-action", "yes");
    			add_location(button1, file$l, 19, 6, 591);
    			attr_dev(footer, "class", "mdc-dialog__actions");
    			add_location(footer, file$l, 10, 4, 317);
    			attr_dev(div1, "class", "mdc-dialog__surface");
    			add_location(div1, file$l, 5, 2, 100);
    			attr_dev(div2, "class", "mdc-dialog__container");
    			add_location(div2, file$l, 4, 0, 62);

    			dispose = [
    				listen_dev(button0, "click", ctx.click_handler),
    				listen_dev(button1, "click", ctx.click_handler_1)
    			];
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, h2);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div1, t3);
    			append_dev(div1, footer);
    			append_dev(footer, button0);
    			append_dev(button0, span0);
    			append_dev(footer, t5);
    			append_dev(footer, button1);
    			append_dev(button1, span1);
    		},

    		p: noop,
    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div2);
    			}

    			run_all(dispose);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$q.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$n($$self) {
    	const click_handler = () => dialog$1.hide();

    	const click_handler_1 = () => dialog$1.hide();

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {};

    	return { click_handler, click_handler_1 };
    }

    class DemoContent$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$n, create_fragment$q, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "DemoContent", options, id: create_fragment$q.name });
    	}
    }

    /* src/cypress-tests/lib-material-io/DialogComponent.svelte generated by Svelte v3.12.1 */

    const file$m = "src/cypress-tests/lib-material-io/DialogComponent.svelte";

    function create_fragment$r(ctx) {
    	var div1, t, div0, current, dispose;

    	var democontent = new DemoContent$1({ $$inline: true });

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			democontent.$$.fragment.c();
    			t = space();
    			div0 = element("div");
    			attr_dev(div0, "class", "mdc-dialog__scrim");
    			add_location(div0, file$m, 17, 4, 360);
    			attr_dev(div1, "class", "mdc-dialog mdc-dialog--open");
    			attr_dev(div1, "role", "alertdialog");
    			attr_dev(div1, "aria-modal", "true");
    			attr_dev(div1, "aria-labelledby", "my-dialog-title");
    			attr_dev(div1, "aria-describedby", "my-dialog-content");
    			add_location(div1, file$m, 9, 0, 173);
    			dispose = listen_dev(div0, "click", ctx.click_handler);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			mount_component(democontent, div1, null);
    			append_dev(div1, t);
    			append_dev(div1, div0);
    			current = true;
    		},

    		p: noop,

    		i: function intro(local) {
    			if (current) return;
    			transition_in(democontent.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(democontent.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div1);
    			}

    			destroy_component(democontent);

    			dispose();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$r.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$o($$self, $$props, $$invalidate) {
    	

    let { isModal = false, show, hide } = $$props;

    	const writable_props = ['isModal', 'show', 'hide'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<DialogComponent> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => !isModal && dialog$1.hide();

    	$$self.$set = $$props => {
    		if ('isModal' in $$props) $$invalidate('isModal', isModal = $$props.isModal);
    		if ('show' in $$props) $$invalidate('show', show = $$props.show);
    		if ('hide' in $$props) $$invalidate('hide', hide = $$props.hide);
    	};

    	$$self.$capture_state = () => {
    		return { isModal, show, hide };
    	};

    	$$self.$inject_state = $$props => {
    		if ('isModal' in $$props) $$invalidate('isModal', isModal = $$props.isModal);
    		if ('show' in $$props) $$invalidate('show', show = $$props.show);
    		if ('hide' in $$props) $$invalidate('hide', hide = $$props.hide);
    	};

    	return { isModal, show, hide, click_handler };
    }

    class DialogComponent$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$o, create_fragment$r, safe_not_equal, ["isModal", "show", "hide"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "DialogComponent", options, id: create_fragment$r.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.show === undefined && !('show' in props)) {
    			console.warn("<DialogComponent> was created without expected prop 'show'");
    		}
    		if (ctx.hide === undefined && !('hide' in props)) {
    			console.warn("<DialogComponent> was created without expected prop 'hide'");
    		}
    	}

    	get isModal() {
    		throw new Error("<DialogComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isModal(value) {
    		throw new Error("<DialogComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get show() {
    		throw new Error("<DialogComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set show(value) {
    		throw new Error("<DialogComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hide() {
    		throw new Error("<DialogComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hide(value) {
    		throw new Error("<DialogComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/cypress-tests/lib-material-io/Dialog.svelte generated by Svelte v3.12.1 */

    const file$n = "src/cypress-tests/lib-material-io/Dialog.svelte";

    function create_fragment$s(ctx) {
    	var div3, div1, div0, button0, t1, button1, t3, div2, current, dispose;

    	var dialog_1 = new Dialog({ $$inline: true });

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			button0 = element("button");
    			button0.textContent = "Show dialog";
    			t1 = space();
    			button1 = element("button");
    			button1.textContent = "Show modal dialog";
    			t3 = space();
    			div2 = element("div");
    			dialog_1.$$.fragment.c();
    			attr_dev(button0, "class", "button");
    			add_location(button0, file$n, 8, 6, 225);
    			attr_dev(button1, "class", "button");
    			add_location(button1, file$n, 19, 6, 463);
    			attr_dev(div0, "class", "buttons");
    			add_location(div0, file$n, 7, 4, 197);
    			attr_dev(div1, "class", "control");
    			attr_dev(div1, "data-test-id", "hide-all");
    			add_location(div1, file$n, 6, 2, 147);
    			attr_dev(div2, "class", "materialIO");
    			add_location(div2, file$n, 33, 2, 749);
    			attr_dev(div3, "class", "test");
    			add_location(div3, file$n, 5, 0, 126);

    			dispose = [
    				listen_dev(button0, "click", ctx.click_handler),
    				listen_dev(button1, "click", ctx.click_handler_1)
    			];
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div1);
    			append_dev(div1, div0);
    			append_dev(div0, button0);
    			append_dev(div0, t1);
    			append_dev(div0, button1);
    			append_dev(div3, t3);
    			append_dev(div3, div2);
    			mount_component(dialog_1, div2, null);
    			current = true;
    		},

    		p: noop,

    		i: function intro(local) {
    			if (current) return;
    			transition_in(dialog_1.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(dialog_1.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div3);
    			}

    			destroy_component(dialog_1);

    			run_all(dispose);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$s.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$p($$self) {
    	const click_handler = () => dialog$1.show({
    	          dialogic: {
    	            component: DialogComponent$1,
    	            className: "dialog",
    	          }
    	        });

    	const click_handler_1 = () => dialog$1.show({
    	          dialogic: {
    	            component: DialogComponent$1,
    	            className: "dialog",
    	          },
    	          isModal: true,
    	        });

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {};

    	return { click_handler, click_handler_1 };
    }

    class Dialog_1$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$p, create_fragment$s, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Dialog_1", options, id: create_fragment$s.name });
    	}
    }

    var routes = {
        "/": Home,
        "/DialogClassName": DialogClassName,
        "/DialogClassNameDelay": DialogClassNameDelay,
        "/DialogStyles": DialogStyles,
        "/DialogIds": DialogIds,
        "/DialogExists": DialogExists,
        "/DialogCount": DialogCount,
        "/DialogHideAll": DialogHideAll,
        "/DialogResetAll": DialogResetAll,
        "/DialogTimeout": DialogTimeout,
        "/DialogQueued": DialogQueued,
        "/NotificationCount": NotificationCount,
        "/NotificationPause": NotificationPause,
        "/NotificationTimeout": NotificationTimeout,
        "/LibBulmaDialog": Dialog_1,
        "/LibMaterialIODialog": Dialog_1$1,
    };

    /* src/App.svelte generated by Svelte v3.12.1 */

    function create_fragment$t(ctx) {
    	var current;

    	var router = new Router({
    		props: { routes: routes },
    		$$inline: true
    	});

    	const block = {
    		c: function create() {
    			router.$$.fragment.c();
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},

    		p: noop,

    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$t.name, type: "component", source: "", ctx });
    	return block;
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$t, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "App", options, id: create_fragment$t.name });
    	}
    }

    var app = new App({
        target: document.body
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
