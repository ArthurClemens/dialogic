(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(exports, require("mithril"), require("mithril-hooks")) : typeof define === "function" && define.amd ? define(["exports", "mithril", "mithril-hooks"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global.dialogicMithril = {}, global.m, global.mithrilHooks));
})(this, function(exports2, m, mithrilHooks) {
  "use strict";
  function g(t) {
    return p(function() {
      return t.map(function(e) {
        return e();
      });
    }, t);
  }
  function h(t, e, u) {
    var n = u.map(function(c) {
      var f = t(e, c);
      return f !== i.SKIP && (e = f), f;
    });
    return n(e), n;
  }
  function l(t, e) {
    var u = t.map(function(c) {
      return c[0];
    }), n = p(function() {
      var c = arguments[arguments.length - 1];
      return u.forEach(function(f, r) {
        c.indexOf(f) > -1 && (e = t[r][1](e, f()));
      }), e;
    }, u);
    return n(e), n;
  }
  function _() {
    var t = arguments[0], e = Array.prototype.slice.call(arguments, 1);
    return g(e).map(function(u) {
      return t.apply(void 0, u);
    });
  }
  function s(t) {
    return t._state === "pending" || t._state === "active" || t._state === "changing";
  }
  var i = function(t) {
    var e = [], u = [];
    function n(r) {
      return arguments.length && r !== i.SKIP && (t = r, s(n) && (n._changing(), n._state = "active", e.slice().forEach(function(a, o) {
        s(a) && a(this[o](t));
      }, u.slice()))), t;
    }
    n.constructor = i, n._state = arguments.length && t !== i.SKIP ? "active" : "pending", n._parents = [], n._changing = function() {
      s(n) && (n._state = "changing"), e.forEach(function(r) {
        r._changing();
      });
    }, n._map = function(r, a) {
      var o = a ? i() : i(r(t));
      return o._parents.push(n), e.push(o), u.push(r), o;
    }, n.map = function(r) {
      return n._map(r, n._state !== "active");
    };
    var c;
    function f() {
      return c = i(), c.map(function(r) {
        return r === true && (n._parents.forEach(function(a) {
          a._unregisterChild(n);
        }), n._state = "ended", n._parents.length = e.length = u.length = 0), r;
      }), c;
    }
    return n.toJSON = function() {
      return t != null && typeof t.toJSON == "function" ? t.toJSON() : t;
    }, n["fantasy-land/map"] = n.map, n["fantasy-land/ap"] = function(r) {
      return p(
        function(a, o) {
          return a()(o());
        },
        [r, n]
      );
    }, n._unregisterChild = function(r) {
      var a = e.indexOf(r);
      a !== -1 && (e.splice(a, 1), u.splice(a, 1));
    }, Object.defineProperty(n, "end", {
      get: function() {
        return c || f();
      }
    }), n;
  };
  function p(t, e) {
    var u = e.every(function(a) {
      if (a.constructor !== i)
        throw new Error(
          "Ensure that each item passed to stream.combine/stream.merge/lift is a stream."
        );
      return a._state === "active";
    }), n = u ? i(t.apply(null, e.concat([e]))) : i(), c = [], f = e.map(function(a) {
      return a._map(function(o) {
        return c.push(a), (u || e.every(function(m2) {
          return m2._state !== "pending";
        })) && (u = true, n(t.apply(null, e.concat([c]))), c = []), o;
      }, true);
    }), r = n.end.map(function(a) {
      a === true && (f.forEach(function(o) {
        o.end(true);
      }), r.end(true));
    });
    return n;
  }
  i.SKIP = {};
  i.lift = _;
  i.scan = h;
  i.merge = g;
  i.combine = p;
  i.scanMerge = l;
  i["fantasy-land/of"] = i;
  var d = false;
  Object.defineProperty(i, "HALT", {
    get: function() {
      return d || console.log("HALT is deprecated and has been renamed to SKIP"), d = true, i.SKIP;
    }
  });
  const findItem = (id, items) => items.find((item) => item.id === id);
  const itemIndex = (id, items) => {
    const item = findItem(id, items);
    return item ? items.indexOf(item) : -1;
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
      store: {}
    },
    actions: (update2) => ({
      /**
       * Add an item to the end of the list.
       */
      add: (ns, item) => {
        update2((state) => {
          const items = state.store[ns] || [];
          state.store[ns] = [...items, item];
          if (item.timer) {
            item.timer.states.map(() => store.actions(update2).refresh());
          }
          return state;
        });
      },
      /**
       * Removes the first item with a match on `id`.
       */
      remove: (ns, id) => {
        update2((state) => {
          const items = state.store[ns] || [];
          const remaining2 = removeItem(id, items);
          state.store[ns] = remaining2;
          return state;
        });
      },
      /**
       * Replaces the first item with a match on `id` with a newItem.
       */
      replace: (ns, id, newItem) => {
        update2((state) => {
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
        update2((state) => {
          state.store[ns] = [];
          return state;
        });
      },
      /**
       * Replaces all items within a namespace.
       */
      store: (ns, newItems) => {
        update2((state) => {
          state.store[ns] = [...newItems];
          return state;
        });
      },
      refresh: () => {
        update2((state) => ({
          ...state
        }));
      }
    }),
    selectors: (states2) => {
      const fns = {
        getStore: () => {
          const state = states2();
          return state.store;
        },
        find: (ns, identityOptions) => {
          const state = states2();
          const items = state.store[ns] || [];
          const id = createId(identityOptions, ns);
          const item = items.find((fitem) => fitem.id === id);
          return item ? { just: item } : { nothing: void 0 };
        },
        getAll: (ns, identityOptions) => {
          const state = states2();
          const items = state.store[ns] || [];
          const spawn = identityOptions !== void 0 ? identityOptions.spawn : void 0;
          const id = identityOptions !== void 0 ? identityOptions.id : void 0;
          const itemsBySpawn = spawn !== void 0 ? items.filter((fitem) => fitem.identityOptions.spawn === spawn) : items;
          const itemsById = id !== void 0 ? itemsBySpawn.filter((item) => item.identityOptions.id === id) : itemsBySpawn;
          return itemsById;
        },
        getCount: (ns, identityOptions) => fns.getAll(ns, identityOptions).length
      };
      return fns;
    }
  };
  const update = i();
  const states = i.scan(
    (state, patch) => patch(state),
    {
      ...store.initialState
    },
    update
  );
  const actions = {
    ...store.actions(update)
  };
  const selectors = {
    ...store.selectors(states)
  };
  const initialState = {
    callback: () => {
    },
    isPaused: false,
    onAbort: () => {
    },
    onDone: () => {
    },
    promise: void 0,
    remaining: void 0,
    startTime: void 0,
    timeoutFn: () => {
    },
    timerId: void 0
  };
  const appendStartTimer = (state, callback, duration, updateState) => {
    const timeoutFn = () => {
      callback();
      state.onDone();
      updateState();
    };
    return {
      timeoutFn,
      promise: new Promise((resolve) => {
        state.onDone = () => resolve();
        state.onAbort = () => resolve();
      }),
      ...state.isPaused ? {} : {
        startTime: new Date().getTime(),
        timerId: window.setTimeout(timeoutFn, duration),
        remaining: duration
      }
    };
  };
  const appendStopTimeout = (state) => {
    window.clearTimeout(state.timerId);
    return {
      timerId: initialState.timerId
    };
  };
  const appendStopTimer = (state) => ({
    ...appendStopTimeout(state)
  });
  const appendPauseTimer = (state) => ({
    ...appendStopTimeout(state),
    isPaused: true,
    remaining: getRemaining$1(state)
  });
  const appendResumeTimer = (state, minimumDuration) => {
    window.clearTimeout(state.timerId);
    const remaining2 = minimumDuration ? Math.max(state.remaining || 0, minimumDuration) : state.remaining;
    return {
      startTime: new Date().getTime(),
      isPaused: false,
      remaining: remaining2,
      timerId: window.setTimeout(state.timeoutFn, remaining2)
    };
  };
  const getRemaining$1 = (state) => state.remaining === 0 || state.remaining === void 0 ? state.remaining : state.remaining - (new Date().getTime() - (state.startTime || 0));
  const TimerStore = () => {
    const timer = {
      initialState,
      actions: (update22) => ({
        /**
         * Starts the timer
         * @param {callback} Function Callback function that is called after completion.
         * @param {duration} Number Timer duration in milliseconds.
         */
        start: (callback, duration) => {
          update22((state) => ({
            ...state,
            ...appendStopTimeout(state),
            ...appendStartTimer(
              state,
              callback,
              duration,
              () => timer.actions(update22).done()
            ),
            ...state.isPaused && appendPauseTimer(state)
          }));
        },
        /**
         * Stops the timer.
         */
        stop: () => {
          update22((state) => ({
            ...state,
            ...appendStopTimer(state),
            ...initialState
          }));
        },
        /**
         * Pauses a running timer.
         */
        pause: () => {
          update22((state) => ({
            ...state,
            ...!state.isPaused && appendPauseTimer(state)
          }));
        },
        /**
         * Resumes a paused timer.
         * @param {minimumDuration} Number Sets the minimum duration.
         */
        resume: (minimumDuration) => {
          update22((state) => ({
            ...state,
            ...state.isPaused && appendResumeTimer(state, minimumDuration)
          }));
        },
        /**
         * Aborts and clears a timer.
         */
        abort: () => {
          update22((state) => {
            state.onAbort();
            return {
              ...state,
              ...appendStopTimeout(state)
            };
          });
        },
        /**
         * Updates the current state. Used to get the state for selectors.getRemaining.
         */
        refresh: () => {
          update22((state) => ({
            ...state
          }));
        },
        /**
         * Brings the timer to its initial state.
         * Used internally.
         */
        done: () => {
          update22(() => initialState);
        }
      }),
      selectors: (states22) => ({
        /**
         * Returns the paused state.
         */
        isPaused: () => {
          const state = states22();
          return state.isPaused;
        },
        /**
         * Returns the remaining duration in milliseconds.
         */
        getRemaining: () => {
          const state = states22();
          return state.isPaused ? state.remaining : getRemaining$1(state);
        },
        /**
         * The promise that is handled when the timer is done or canceled.
         */
        getResultPromise: () => {
          const state = states22();
          return state.promise;
        }
      })
    };
    const update2 = i();
    const states2 = i.scan(
      (state, patch) => patch(state),
      {
        ...timer.initialState
      },
      update2
    );
    const actions2 = {
      ...timer.actions(update2)
    };
    const selectors2 = {
      ...timer.selectors(states2)
    };
    return {
      states: states2,
      actions: actions2,
      selectors: selectors2
    };
  };
  const pipe = (...fns) => (x) => fns.filter(Boolean).reduce((y, f) => f(y), x);
  const getStyleValue = ({
    domElement,
    prop
  }) => {
    const defaultView = document.defaultView;
    if (defaultView) {
      const style = defaultView.getComputedStyle(domElement);
      if (style) {
        return style.getPropertyValue(prop);
      }
    }
    return void 0;
  };
  const MODE = {
    SHOW: "show",
    HIDE: "hide"
  };
  const removeTransitionClassNames = (domElement, transitionClassNames) => domElement.classList.remove(
    ...transitionClassNames.showStart,
    ...transitionClassNames.showEnd,
    ...transitionClassNames.hideStart,
    ...transitionClassNames.hideEnd
  );
  const applyTransitionStyles = (domElement, step, styles) => {
    const transitionStyle = styles[step];
    if (transitionStyle) {
      Object.keys(transitionStyle).forEach((key) => {
        const value = transitionStyle[key];
        domElement.style[key] = value;
      });
    }
  };
  const applyNoDurationTransitionStyle = (domElement) => {
    domElement.style.transitionDuration = "0ms";
  };
  const getTransitionStyles = (domElement, styles) => (typeof styles === "function" ? styles(domElement) : styles) || {};
  const createClassList = (className, step) => className.split(/ /).map((n) => `${n}-${step}`);
  const applyStylesForState = (domElement, props, step, isEnterStep) => {
    if (props.styles) {
      const styles = getTransitionStyles(domElement, props.styles);
      applyTransitionStyles(domElement, "default", styles);
      if (isEnterStep) {
        applyNoDurationTransitionStyle(domElement);
      }
      applyTransitionStyles(domElement, step, styles);
    }
    if (props.className) {
      const transitionClassNames = {
        showStart: createClassList(props.className, "show-start"),
        showEnd: createClassList(props.className, "show-end"),
        hideStart: createClassList(props.className, "hide-start"),
        hideEnd: createClassList(props.className, "hide-end")
      };
      removeTransitionClassNames(domElement, transitionClassNames);
      if (transitionClassNames) {
        domElement.classList.add(...transitionClassNames[step]);
      }
    }
    domElement.scrollTop;
  };
  const styleDurationToMs = (durationStr) => {
    const parsed = parseFloat(durationStr) * (durationStr.indexOf("ms") === -1 ? 1e3 : 1);
    return Number.isNaN(parsed) ? 0 : parsed;
  };
  const getDuration = (domElement) => {
    const durationStyleValue = getStyleValue({
      domElement,
      prop: "transition-duration"
    });
    const durationValue = durationStyleValue !== void 0 ? styleDurationToMs(durationStyleValue) : 0;
    const delayStyleValue = getStyleValue({
      domElement,
      prop: "transition-delay"
    });
    const delayValue = delayStyleValue !== void 0 ? styleDurationToMs(delayStyleValue) : 0;
    return durationValue + delayValue;
  };
  const steps = {
    showStart: {
      nextStep: "showEnd"
    },
    showEnd: {
      nextStep: void 0
    },
    hideStart: {
      nextStep: "hideEnd"
    },
    hideEnd: {
      nextStep: void 0
    }
  };
  const transition = (props, mode) => {
    const { domElement } = props;
    if (!domElement) {
      return Promise.resolve("no domElement");
    }
    clearTimeout(props.__transitionTimeoutId__);
    let currentStep = mode === MODE.SHOW ? "showStart" : "hideStart";
    return new Promise((resolve) => {
      applyStylesForState(
        domElement,
        props,
        currentStep,
        currentStep === "showStart"
      );
      setTimeout(() => {
        const { nextStep } = steps[currentStep];
        if (nextStep) {
          currentStep = nextStep;
          applyStylesForState(domElement, props, currentStep);
          const duration = getDuration(domElement);
          props.__transitionTimeoutId__ = window.setTimeout(resolve, duration);
        }
      }, 0);
    });
  };
  const localState = {
    uid: 0
  };
  const getUid = () => {
    if (localState.uid === Number.MAX_VALUE) {
      localState.uid = 0;
    } else {
      localState.uid += 1;
    }
    return localState.uid;
  };
  const getMaybeItem = (ns) => (defaultDialogicOptions) => (identityOptions) => selectors.find(
    ns,
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    getMergedIdentityOptions(defaultDialogicOptions, identityOptions)
  );
  const filterBySpawn = (identityOptions) => (items) => identityOptions.spawn !== void 0 ? items.filter(
    (item) => item.identityOptions.spawn === identityOptions.spawn
  ) : items;
  const filterById = (identityOptions) => (items) => identityOptions.id !== void 0 ? items.filter((item) => item.identityOptions.id === identityOptions.id) : items;
  const filterFirstInQueue = (nsItems) => {
    let queuedCount = 0;
    return nsItems.map((item) => ({
      item,
      queueCount: item.dialogicOptions.queued ? queuedCount++ : 0
    })).filter(({ queueCount }) => queueCount === 0).map(({ item }) => item);
  };
  const filterCandidates = (ns, items, identityOptions) => {
    const nsItems = items[ns] || [];
    if (nsItems.length === 0) {
      return [];
    }
    return pipe(filterBySpawn(identityOptions), filterFirstInQueue)(nsItems);
  };
  const getPassThroughOptions = (options) => {
    const copy = {
      ...options
    };
    delete copy.dialogic;
    return copy;
  };
  const getMergedIdentityOptions = (defaultDialogicOptions, identityOptions = {}) => ({
    id: identityOptions.id || defaultDialogicOptions.id,
    spawn: identityOptions.spawn || defaultDialogicOptions.spawn
  });
  const handleOptions = (defaultDialogicOptions, options) => {
    const identityOptions = {
      id: (options == null ? void 0 : options.dialogic) ? options.dialogic.id : void 0,
      spawn: (options == null ? void 0 : options.dialogic) ? options.dialogic.spawn : void 0
    };
    const mergedIdentityOptions = getMergedIdentityOptions(
      defaultDialogicOptions || {},
      identityOptions
    );
    const dialogicOptions = {
      ...defaultDialogicOptions,
      ...options == null ? void 0 : options.dialogic,
      __transitionTimeoutId__: 0
    };
    const passThroughOptions = options ? getPassThroughOptions(options) : {};
    return {
      identityOptions: mergedIdentityOptions,
      dialogicOptions,
      passThroughOptions
    };
  };
  const createInstance = (ns) => (defaultDialogicOptions) => (options) => {
    const { identityOptions, dialogicOptions, passThroughOptions } = handleOptions(defaultDialogicOptions, options);
    return new Promise((resolve) => {
      const callbacks = {
        willShow: (item2) => {
          if (dialogicOptions.willShow) {
            dialogicOptions.willShow(item2);
          }
          return resolve(item2);
        },
        willHide: (item2) => {
          if (dialogicOptions.willHide) {
            dialogicOptions.willHide(item2);
          }
          return resolve(item2);
        },
        didShow: (item2) => {
          if (dialogicOptions.didShow) {
            dialogicOptions.didShow(item2);
          }
          return resolve(item2);
        },
        didHide: (item2) => {
          if (dialogicOptions.didHide) {
            dialogicOptions.didHide(item2);
          }
          return resolve(item2);
        }
      };
      const item = {
        ns,
        identityOptions,
        dialogicOptions,
        callbacks,
        passThroughOptions,
        id: createId(identityOptions, ns),
        timer: dialogicOptions.timeout ? TimerStore() : void 0,
        // when timeout is undefined or 0
        key: getUid().toString(),
        // Uniquely identify each item for keyed display
        transitionState: 0
        /* Default */
      };
      const maybeExistingItem = selectors.find(
        ns,
        identityOptions
      );
      const existingItem = maybeExistingItem.just;
      if (existingItem && dialogicOptions.toggle) {
        hide(ns)(defaultDialogicOptions)(options);
        return resolve(existingItem);
      }
      if (existingItem && !dialogicOptions.queued) {
        const replacingItem = {
          ...item,
          key: existingItem.key,
          transitionState: existingItem.transitionState,
          dialogicOptions: existingItem.dialogicOptions
          // Preserve dialogicOptions
        };
        actions.replace(ns, existingItem.id, replacingItem);
      } else {
        actions.add(ns, item);
      }
      resolve(item);
    });
  };
  const show = createInstance;
  const hide = (ns) => (defaultDialogicOptions) => (options) => {
    const { identityOptions, dialogicOptions, passThroughOptions } = handleOptions(defaultDialogicOptions, options);
    const maybeExistingItem = selectors.find(
      ns,
      identityOptions
    );
    const existingItem = maybeExistingItem.just;
    if (existingItem) {
      const item = {
        ...existingItem,
        dialogicOptions: {
          ...existingItem.dialogicOptions,
          ...dialogicOptions
        },
        passThroughOptions: {
          ...existingItem.passThroughOptions,
          passThroughOptions
        }
      };
      actions.replace(ns, existingItem.id, item);
      if (item.transitionState !== 2) {
        return hideItem(item);
      }
      return Promise.resolve(item);
    }
    return Promise.resolve({
      ns,
      id: identityOptions.id
    });
  };
  const pause = (ns) => (_defaultDialogicOptions) => (identityOptions) => {
    const validItems = getValidItems(ns, identityOptions).filter(
      (item) => !!item.timer
    );
    validItems.forEach((item) => {
      if (item.timer) {
        item.timer.actions.pause();
      }
    });
    return Promise.all(validItems);
  };
  const resume = (ns) => (_defaultDialogicOptions) => (commandOptions) => {
    const options = commandOptions || {};
    const identityOptions = {
      id: options.id,
      spawn: options.spawn
    };
    const validItems = getValidItems(ns, identityOptions).filter(
      (item) => !!item.timer
    );
    validItems.forEach((item) => {
      if (item.timer) {
        item.timer.actions.resume(options.minimumDuration);
      }
    });
    return Promise.all(validItems);
  };
  const getTimerSelectors = (ns, defaultDialogicOptions, identityOptions) => {
    var _a, _b;
    const maybeItem = getMaybeItem(ns)(
      defaultDialogicOptions
    )(identityOptions);
    return (_b = (_a = maybeItem == null ? void 0 : maybeItem.just) == null ? void 0 : _a.timer) == null ? void 0 : _b.selectors;
  };
  const isPaused = (ns) => (defaultDialogicOptions) => (identityOptions) => {
    var _a;
    return ((_a = getTimerSelectors(
      ns,
      defaultDialogicOptions,
      identityOptions
    )) == null ? void 0 : _a.isPaused()) || false;
  };
  const getRemaining = (ns) => (defaultDialogicOptions) => (identityOptions) => {
    var _a;
    return ((_a = getTimerSelectors(
      ns,
      defaultDialogicOptions,
      identityOptions
    )) == null ? void 0 : _a.getRemaining()) || void 0;
  };
  const exists = (ns) => (_defaultDialogicOptions) => (identityOptions) => (
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    !!getValidItems(ns, identityOptions).length
  );
  const getValidItems = (ns, identityOptions) => {
    const allItems = selectors.getAll(ns);
    let validItems;
    if (identityOptions) {
      validItems = pipe(
        filterBySpawn(identityOptions),
        filterById(identityOptions)
      )(allItems);
    } else {
      validItems = allItems;
    }
    return validItems;
  };
  const resetAll = (ns) => (_defaultDialogicOptions) => (identityOptions) => {
    const validItems = getValidItems(ns, identityOptions);
    const items = [];
    validItems.forEach((item) => {
      if (item.timer) {
        item.timer.actions.abort();
      }
      items.push(item);
    });
    if (identityOptions) {
      items.forEach((item) => {
        actions.remove(ns, item.id);
      });
    } else {
      actions.removeAll(ns);
    }
    return Promise.resolve(items);
  };
  const getOverridingTransitionOptions = (item, dialogicOptions) => ({
    ...item,
    dialogicOptions: {
      ...item.dialogicOptions,
      ...dialogicOptions
    }
  });
  const hideAll = (ns) => (_defaultDialogicOptions) => (dialogicOptions) => {
    const options = dialogicOptions || {};
    const identityOptions = {
      id: options.id,
      spawn: options.spawn
    };
    const validItems = getValidItems(ns, identityOptions);
    const regularItems = validItems.filter(
      (item) => !options.queued && !item.dialogicOptions.queued
    );
    const queuedItems = validItems.filter(
      (item) => options.queued || item.dialogicOptions.queued
    );
    const items = [];
    regularItems.forEach(
      (item) => (
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        items.push(hideItem(getOverridingTransitionOptions(item, options)))
      )
    );
    if (queuedItems.length > 0) {
      const [current] = queuedItems;
      actions.store(ns, [current]);
      items.push(hideItem(getOverridingTransitionOptions(current, options)));
    }
    return Promise.all(items);
  };
  const getCount = (ns) => (identityOptions) => selectors.getCount(ns, identityOptions);
  const transitionItem = (item, mode) => transition(item.dialogicOptions, mode);
  const getResultPromise = () => (ns) => (defaultDialogicOptions) => (identityOptions) => {
    const maybeItem = getMaybeItem(ns)(
      defaultDialogicOptions
    )(identityOptions);
    if (maybeItem.just) {
      if (maybeItem.just && maybeItem.just.timer) {
        return maybeItem.just.timer.selectors.getResultPromise();
      }
      return void 0;
    }
    return void 0;
  };
  const deferredHideItem = async (item, timer, timeout) => {
    timer.actions.start(() => hideItem(item), timeout);
    return getResultPromise();
  };
  const showItem = async (item) => {
    if (item.callbacks.willShow) {
      item.callbacks.willShow(item);
    }
    if (item.transitionState !== 1) {
      item.transitionState = 1;
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
  const hideItem = async (item) => {
    item.transitionState = 2;
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
      ...item
    };
    actions.remove(item.ns, item.id);
    return Promise.resolve(copy);
  };
  const setDomElement = (domElement, item) => {
    item.dialogicOptions.domElement = domElement;
  };
  const dialogical = ({
    ns,
    queued,
    timeout
  }) => {
    const defaultId = `default_${ns}`;
    const defaultSpawn = `default_${ns}`;
    const defaultDialogicOptions = {
      id: defaultId,
      spawn: defaultSpawn,
      ...queued && { queued },
      ...timeout !== void 0 && { timeout }
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
      getRemaining: getRemaining(ns)(defaultDialogicOptions)
    };
  };
  const dialog = dialogical({ ns: "dialog" });
  const notification = dialogical({
    ns: "notification",
    queued: true,
    timeout: 3e3
  });
  const remaining = (props) => {
    let displayValue;
    let reqId;
    let isCanceled = false;
    const identity = {
      id: props.id,
      spawn: props.spawn
    };
    const update2 = () => {
      const remainingValue = props.instance.getRemaining(identity);
      if (displayValue !== remainingValue) {
        displayValue = remainingValue === void 0 ? remainingValue : props.roundToSeconds ? Math.round(Math.max(remainingValue, 0) / 1e3) : Math.max(remainingValue, 0);
      }
      props.callback(displayValue);
      if (!props.instance.exists(identity)) {
        window.cancelAnimationFrame(reqId);
        isCanceled = true;
      } else if (!isCanceled) {
        reqId = window.requestAnimationFrame(update2);
      }
    };
    reqId = window.requestAnimationFrame(update2);
  };
  const types = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null
  }, Symbol.toStringTag, { value: "Module" }));
  const Instance = ({
    attrs: componentAttrs
  }) => {
    let domElement;
    const dispatchTransition = (dispatchFn) => {
      dispatchFn({
        detail: {
          identityOptions: componentAttrs.identityOptions,
          domElement
        }
      });
    };
    const onMount = () => {
      dispatchTransition(componentAttrs.onMount);
    };
    const show2 = () => {
      dispatchTransition(componentAttrs.onShow);
    };
    const hide2 = () => {
      dispatchTransition(componentAttrs.onHide);
    };
    return {
      oncreate: (vnode) => {
        domElement = vnode.dom;
        onMount();
      },
      view: ({ attrs }) => {
        const component = attrs.dialogicOptions.component;
        if (!component) {
          throw new Error("Component missing in dialogic options.");
        }
        const passThroughOptions = attrs.passThroughOptions || {};
        return m(
          "div",
          { className: attrs.dialogicOptions.className },
          m(component, {
            ...passThroughOptions,
            show: show2,
            hide: hide2
          })
        );
      }
    };
  };
  const handleDispatch = (ns) => (event, fn) => {
    const maybeItem = selectors.find(
      ns,
      event.detail.identityOptions
    );
    if (maybeItem.just) {
      setDomElement(event.detail.domElement, maybeItem.just);
    }
    const maybeTransitioningItem = selectors.find(
      ns,
      event.detail.identityOptions
    );
    if (maybeTransitioningItem.just) {
      fn(maybeTransitioningItem.just);
    }
  };
  const onInstanceMounted = (ns) => (event) => handleDispatch(ns)(event, showItem);
  const onShowInstance = (ns) => (event) => handleDispatch(ns)(event, showItem);
  const onHideInstance = (ns) => (event) => handleDispatch(ns)(event, hideItem);
  const Wrapper = {
    view: ({ attrs }) => {
      const nsOnInstanceMounted = onInstanceMounted(attrs.ns);
      const nsOnShowInstance = onShowInstance(attrs.ns);
      const nsOnHideInstance = onHideInstance(attrs.ns);
      const identityOptions = attrs.identityOptions || {};
      const filtered = filterCandidates(
        attrs.ns,
        selectors.getStore(),
        identityOptions
      );
      return filtered.map(
        (item) => m(Instance, {
          key: item.key,
          identityOptions: item.identityOptions,
          dialogicOptions: item.dialogicOptions,
          passThroughOptions: item.passThroughOptions,
          onMount: nsOnInstanceMounted,
          onShow: nsOnShowInstance,
          onHide: nsOnHideInstance
        })
      );
    }
  };
  const Dialogical = (instance) => ({
    oncreate: ({ attrs }) => {
      if (typeof attrs.onMount === "function") {
        attrs.onMount();
      }
    },
    view: ({ attrs }) => {
      const identityOptions = {
        id: attrs.id || instance.defaultId,
        spawn: attrs.spawn || instance.defaultSpawn
      };
      return m(Wrapper, {
        identityOptions,
        ns: instance.ns
      });
    }
  });
  let useDialogicCounter = 0;
  const useDialogic = ({
    isIgnore,
    isShow,
    isHide,
    instance,
    deps = [],
    props = {}
  }) => {
    const [id] = mithrilHooks.useState(useDialogicCounter++);
    const augProps = {
      ...props,
      ...(props == null ? void 0 : props.dialogic) ? {
        dialogic: {
          ...props.dialogic,
          id: props.dialogic.id || id
        }
      } : {
        dialogic: {
          id
        }
      }
    };
    const showInstance = () => {
      instance.show(augProps);
    };
    const hideInstance = () => {
      instance.hide(augProps);
    };
    mithrilHooks.useEffect(() => {
      if (isIgnore) {
        return;
      }
      if (isShow !== void 0) {
        if (isShow) {
          showInstance();
        } else {
          hideInstance();
        }
      }
    }, [...deps, isShow]);
    mithrilHooks.useEffect(() => {
      if (isIgnore) {
        return;
      }
      if (isHide !== void 0) {
        if (isHide) {
          hideInstance();
        }
      }
    }, [...deps, isHide]);
    mithrilHooks.useEffect(() => {
      if (isIgnore) {
        return void 0;
      }
      return () => {
        hideInstance();
      };
    }, []);
    return {
      show: showInstance,
      hide: hideInstance
    };
  };
  const useDialog = (props) => useDialogic({ instance: dialog, ...props });
  const useNotification = (props) => useDialogic({
    instance: notification,
    ...props
  });
  const useRemaining = ({
    instance,
    id,
    spawn,
    roundToSeconds
  }) => {
    const [value, setValue] = mithrilHooks.useState(void 0);
    const identity = {
      id,
      spawn
    };
    const exists2 = !!instance.exists(identity);
    mithrilHooks.useMemo(() => {
      if (exists2) {
        remaining({
          ...identity,
          instance,
          roundToSeconds,
          callback: (newValue) => {
            setValue(newValue);
          }
        });
      }
    }, [exists2]);
    return [value];
  };
  const Dialog = Dialogical(dialog);
  const Notification = Dialogical(notification);
  states.map((_state) => {
    m.redraw();
  });
  exports2.Dialog = Dialog;
  exports2.Dialogic = types;
  exports2.Dialogical = Dialogical;
  exports2.Notification = Notification;
  exports2.dialog = dialog;
  exports2.notification = notification;
  exports2.remaining = remaining;
  exports2.useDialog = useDialog;
  exports2.useDialogic = useDialogic;
  exports2.useNotification = useNotification;
  exports2.useRemaining = useRemaining;
  Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
});
//# sourceMappingURL=dialogic-mithril.umd.js.map
