import { states, selectors, isPaused as isPaused$1, exists as exists$1, dialog as dialog$1, notification as notification$1, setDomElement, showItem, hideItem, filterCandidates } from 'dialogic';
import { writable, derived } from 'svelte/store';
import { SvelteComponent, init, safe_not_equal, element, create_component, attr, insert, mount_component, get_spread_update, get_spread_object, group_outros, transition_out, destroy_component, check_outros, transition_in, detach, assign, binding_callbacks, empty, update_keyed_each, outro_and_destroy_block, component_subscribe, exclude_internal_props } from 'svelte/internal';
import { createEventDispatcher, onMount } from 'svelte';

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
const getCount = ns => identityOptions =>
  derived(appState, () => selectors.getCount(ns, identityOptions));
const isPaused = ns => defaultDialogicOptions => identityOptions =>
  derived(appState, () =>
    isPaused$1(ns)(defaultDialogicOptions)(identityOptions),
  );
const exists = ns => defaultDialogicOptions => identityOptions =>
  derived(appState, () =>
    exists$1(ns)(defaultDialogicOptions)(identityOptions),
  );

const dialog = {
  ...dialog$1,
  getCount: identityOptions => getCount(dialog$1.ns)(identityOptions),
  isPaused: identityOptions =>
    isPaused(dialog$1.ns)(dialog$1.defaultDialogicOptions)(identityOptions),
  exists: identityOptions =>
    exists(dialog$1.ns)(dialog$1.defaultDialogicOptions)(identityOptions),
};

const notification = {
  ...notification$1,
  getCount: identityOptions => getCount(notification$1.ns)(identityOptions),
  isPaused: identityOptions =>
    isPaused(notification$1.ns)(notification$1.defaultDialogicOptions)(
      identityOptions,
    ),
  exists: identityOptions =>
    exists(notification$1.ns)(notification$1.defaultDialogicOptions)(
      identityOptions,
    ),
};

const handleDispatch = ns => (event, fn) => {
  const maybeItem = selectors.find(ns, event.detail.identityOptions);
  if (maybeItem.just) {
    setDomElement(event.detail.domElement, maybeItem.just);
  }
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

/* src/Instance.svelte generated by Svelte v3.23.2 */

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

		return { props: switch_instance_props };
	}

	if (switch_value) {
		switch_instance = new switch_value(switch_props());
	}

	return {
		c() {
			div = element("div");
			if (switch_instance) create_component(switch_instance.$$.fragment);
			attr(div, "class", /*className*/ ctx[3]);
		},
		m(target, anchor) {
			insert(target, div, anchor);

			if (switch_instance) {
				mount_component(switch_instance, div, null);
			}

			/*div_binding*/ ctx[7](div);
			current = true;
		},
		p(ctx, [dirty]) {
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
		i(local) {
			if (current) return;
			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
			current = true;
		},
		o(local) {
			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div);
			if (switch_instance) destroy_component(switch_instance);
			/*div_binding*/ ctx[7](null);
		}
	};
}

function instance($$self, $$props, $$invalidate) {
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

	function div_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			domElement = $$value;
			$$invalidate(2, domElement);
		});
	}

	$$self.$set = $$props => {
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
		div_binding
	];
}

class Instance extends SvelteComponent {
	constructor(options) {
		super();

		init(this, options, instance, create_fragment, safe_not_equal, {
			identityOptions: 6,
			passThroughOptions: 0,
			dialogicOptions: 1
		});
	}
}

/* src/Wrapper.svelte generated by Svelte v3.23.2 */

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
			}
		});

	instance.$on("mount", /*nsOnInstanceMounted*/ ctx[3]);
	instance.$on("show", /*nsOnShowInstance*/ ctx[4]);
	instance.$on("hide", /*nsOnHideInstance*/ ctx[5]);

	return {
		key: key_1,
		first: null,
		c() {
			first = empty();
			create_component(instance.$$.fragment);
			this.first = first;
		},
		m(target, anchor) {
			insert(target, first, anchor);
			mount_component(instance, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const instance_changes = {};
			if (dirty & /*ns, $appState, identityOptions*/ 7) instance_changes.identityOptions = /*identityOptions*/ ctx[1];
			if (dirty & /*ns, $appState, identityOptions*/ 7) instance_changes.dialogicOptions = /*dialogicOptions*/ ctx[6];
			if (dirty & /*ns, $appState, identityOptions*/ 7) instance_changes.passThroughOptions = /*passThroughOptions*/ ctx[7];
			instance.$set(instance_changes);
		},
		i(local) {
			if (current) return;
			transition_in(instance.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(instance.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(first);
			destroy_component(instance, detaching);
		}
	};
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

	return {
		c() {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			each_1_anchor = empty();
		},
		m(target, anchor) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(target, anchor);
			}

			insert(target, each_1_anchor, anchor);
			current = true;
		},
		p(ctx, [dirty]) {
			if (dirty & /*filterCandidates, ns, $appState, identityOptions, nsOnInstanceMounted, nsOnShowInstance, nsOnHideInstance*/ 63) {
				const each_value = filterCandidates(/*ns*/ ctx[0], /*$appState*/ ctx[2].store, /*identityOptions*/ ctx[1]);
				group_outros();
				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block, each_1_anchor, get_each_context);
				check_outros();
			}
		},
		i(local) {
			if (current) return;

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o(local) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d(detaching) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].d(detaching);
			}

			if (detaching) detach(each_1_anchor);
		}
	};
}

function instance_1($$self, $$props, $$invalidate) {
	let $appState;
	component_subscribe($$self, appState, $$value => $$invalidate(2, $appState = $$value));
	let { identityOptions } = $$props;
	let { ns } = $$props;
	const nsOnInstanceMounted = onInstanceMounted(ns);
	const nsOnShowInstance = onShowInstance(ns);
	const nsOnHideInstance = onHideInstance(ns);

	$$self.$set = $$props => {
		if ("identityOptions" in $$props) $$invalidate(1, identityOptions = $$props.identityOptions);
		if ("ns" in $$props) $$invalidate(0, ns = $$props.ns);
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

class Wrapper extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance_1, create_fragment$1, safe_not_equal, { identityOptions: 1, ns: 0 });
	}
}

/* src/Dialogical.svelte generated by Svelte v3.23.2 */

function create_fragment$2(ctx) {
	let wrapper;
	let current;

	wrapper = new Wrapper({
			props: {
				identityOptions: /*identityOptions*/ ctx[1],
				ns: /*ns*/ ctx[0]
			}
		});

	return {
		c() {
			create_component(wrapper.$$.fragment);
		},
		m(target, anchor) {
			mount_component(wrapper, target, anchor);
			current = true;
		},
		p(ctx, [dirty]) {
			const wrapper_changes = {};
			if (dirty & /*ns*/ 1) wrapper_changes.ns = /*ns*/ ctx[0];
			wrapper.$set(wrapper_changes);
		},
		i(local) {
			if (current) return;
			transition_in(wrapper.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(wrapper.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(wrapper, detaching);
		}
	};
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

	$$self.$set = $$props => {
		if ("type" in $$props) $$invalidate(2, type = $$props.type);
		if ("ns" in $$props) $$invalidate(0, ns = $$props.ns);
		if ("spawn" in $$props) $$invalidate(3, spawn = $$props.spawn);
		if ("id" in $$props) $$invalidate(4, id = $$props.id);
		if ("onMount" in $$props) $$invalidate(5, onMount$1 = $$props.onMount);
	};

	return [ns, identityOptions, type, spawn, id, onMount$1];
}

class Dialogical extends SvelteComponent {
	constructor(options) {
		super();

		init(this, options, instance$1, create_fragment$2, safe_not_equal, {
			type: 2,
			ns: 0,
			spawn: 3,
			id: 4,
			onMount: 5
		});
	}
}

/* src/Dialog.svelte generated by Svelte v3.23.2 */

function create_fragment$3(ctx) {
	let dialogical;
	let current;
	const dialogical_spread_levels = [/*$$props*/ ctx[0], { type: dialog }];
	let dialogical_props = {};

	for (let i = 0; i < dialogical_spread_levels.length; i += 1) {
		dialogical_props = assign(dialogical_props, dialogical_spread_levels[i]);
	}

	dialogical = new Dialogical({ props: dialogical_props });

	return {
		c() {
			create_component(dialogical.$$.fragment);
		},
		m(target, anchor) {
			mount_component(dialogical, target, anchor);
			current = true;
		},
		p(ctx, [dirty]) {
			const dialogical_changes = (dirty & /*$$props, dialog*/ 1)
			? get_spread_update(dialogical_spread_levels, [
					dirty & /*$$props*/ 1 && get_spread_object(/*$$props*/ ctx[0]),
					dirty & /*dialog*/ 0 && { type: dialog }
				])
			: {};

			dialogical.$set(dialogical_changes);
		},
		i(local) {
			if (current) return;
			transition_in(dialogical.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(dialogical.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(dialogical, detaching);
		}
	};
}

function instance$2($$self, $$props, $$invalidate) {
	$$self.$set = $$new_props => {
		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
	};

	$$props = exclude_internal_props($$props);
	return [$$props];
}

class Dialog extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$2, create_fragment$3, safe_not_equal, {});
	}
}

/* src/Notification.svelte generated by Svelte v3.23.2 */

function create_fragment$4(ctx) {
	let dialogical;
	let current;
	const dialogical_spread_levels = [/*$$props*/ ctx[0], { type: notification }];
	let dialogical_props = {};

	for (let i = 0; i < dialogical_spread_levels.length; i += 1) {
		dialogical_props = assign(dialogical_props, dialogical_spread_levels[i]);
	}

	dialogical = new Dialogical({ props: dialogical_props });

	return {
		c() {
			create_component(dialogical.$$.fragment);
		},
		m(target, anchor) {
			mount_component(dialogical, target, anchor);
			current = true;
		},
		p(ctx, [dirty]) {
			const dialogical_changes = (dirty & /*$$props, notification*/ 1)
			? get_spread_update(dialogical_spread_levels, [
					dirty & /*$$props*/ 1 && get_spread_object(/*$$props*/ ctx[0]),
					dirty & /*notification*/ 0 && { type: notification }
				])
			: {};

			dialogical.$set(dialogical_changes);
		},
		i(local) {
			if (current) return;
			transition_in(dialogical.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(dialogical.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(dialogical, detaching);
		}
	};
}

function instance$3($$self, $$props, $$invalidate) {
	$$self.$set = $$new_props => {
		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
	};

	$$props = exclude_internal_props($$props);
	return [$$props];
}

class Notification extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$3, create_fragment$4, safe_not_equal, {});
	}
}

export { Dialog, Dialogical, Notification, dialog, notification };
