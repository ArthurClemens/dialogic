import { jsx, Fragment } from 'react/jsx-runtime';
import { states, selectors, setDomElement, showItem, hideItem, filterCandidates, dialog, notification, remaining } from 'dialogic';
export { Dialogic, dialog, notification } from 'dialogic';
import { useRef, useCallback, useEffect, useState, useMemo } from 'react';
import { useStream } from 'use-stream';

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

const useDialogicState = () => {
    // Subscribe to changes
    useStream({
        model: () => ({
            _: states,
        }),
        defer: true,
    });
};

const Instance = (props) => {
    const domElementRef = useRef();
    const { className } = props.dialogicOptions;
    const Component = props.dialogicOptions
        .component;
    if (!Component) {
        throw new Error('Component missing in dialogic options.');
    }
    const dispatchTransition = (dispatchFn) => {
        const domElement = domElementRef.current;
        if (domElement === undefined) {
            return;
        }
        dispatchFn({
            detail: {
                identityOptions: props.identityOptions,
                domElement,
            },
        });
    };
    const onMount = () => {
        dispatchTransition(props.onMount);
    };
    const show = () => {
        dispatchTransition(props.onShow);
    };
    const hide = () => {
        dispatchTransition(props.onHide);
    };
    const domElementCb = useCallback(node => {
        if (node !== null) {
            domElementRef.current = node;
            onMount();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const passThroughOptions = props.passThroughOptions || {};
    return (jsx("div", Object.assign({ ref: domElementCb, className: className }, { children: jsx(Component, Object.assign({}, passThroughOptions, { show: show, hide: hide }), void 0) }), void 0));
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
const onInstanceMounted = (ns) => (event) => handleDispatch(ns)(event, showItem);
const onShowInstance = (ns) => (event) => handleDispatch(ns)(event, showItem);
const onHideInstance = (ns) => (event) => handleDispatch(ns)(event, hideItem);

const Wrapper = (props) => {
    const nsOnInstanceMounted = onInstanceMounted(props.ns);
    const nsOnShowInstance = onShowInstance(props.ns);
    const nsOnHideInstance = onHideInstance(props.ns);
    const identityOptions = props.identityOptions || {};
    const filtered = filterCandidates(props.ns, selectors.getStore(), identityOptions);
    return (jsx(Fragment, { children: filtered.map(item => (jsx(Instance, { identityOptions: item.identityOptions, dialogicOptions: item.dialogicOptions, passThroughOptions: item.passThroughOptions, onMount: nsOnInstanceMounted, onShow: nsOnShowInstance, onHide: nsOnHideInstance }, item.key))) }, void 0));
};

const Dialogical = (_a) => {
    var { instance } = _a, props = __rest(_a, ["instance"]);
    useDialogicState();
    const identityOptions = {
        id: props.id || instance.defaultId,
        spawn: props.spawn || instance.defaultSpawn,
    };
    // Mount
    useEffect(() => {
        if (typeof props.onMount === 'function') {
            props.onMount();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return jsx(Wrapper, { identityOptions: identityOptions, ns: instance.ns }, void 0);
};

let useDialogicCounter = 0;
const useDialogic = ({ isIgnore, isShow, isHide, instance, deps = [], props = {}, }) => {
    // Create an id if not set.
    // This is useful for pages with multiple dialogs, where we can't expect
    // to have the user set an explicit id for each.
    // eslint-disable-next-line no-plusplus
    const [id] = useState(useDialogicCounter++);
    const augProps = Object.assign(Object.assign({}, props), (props.dialogic
        ? {
            dialogic: Object.assign(Object.assign({}, props.dialogic), { id: props.dialogic.id || id }),
        }
        : {
            dialogic: {
                id,
            },
        }));
    const showInstance = () => {
        instance.show(augProps);
    };
    const hideInstance = () => {
        instance.hide(augProps);
    };
    // maybe show
    useEffect(() => {
        if (isIgnore)
            return;
        if (isShow !== undefined) {
            if (isShow) {
                showInstance();
            }
            else {
                hideInstance();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...deps, isShow]);
    // maybe hide
    useEffect(() => {
        if (isIgnore)
            return;
        if (isHide !== undefined) {
            if (isHide) {
                hideInstance();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...deps, isHide]);
    // unmount
    useEffect(() => {
        if (isIgnore)
            return;
        // eslint-disable-next-line consistent-return
        return () => {
            hideInstance();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return {
        show: showInstance,
        hide: hideInstance,
    };
};
const useDialog = (props) => useDialogic(Object.assign(Object.assign({}, props), { instance: dialog }));
const useNotification = (props) => useDialogic(Object.assign(Object.assign({}, props), { instance: notification }));
/**
 * Helper component that wraps `useDialogic` to use with JSX syntax.
 */
const UseDialogic = (props) => {
    useDialogic(props);
    return null;
};
const UseDialog = (props) => jsx(UseDialogic, Object.assign({}, props, { instance: dialog }), void 0);
const UseNotification = (props) => jsx(UseDialogic, Object.assign({}, props, { instance: notification }), void 0);

const useRemaining = ({ instance, id, spawn, roundToSeconds, }) => {
    const [value, setValue] = useState(undefined);
    const identity = {
        id,
        spawn,
    };
    const exists = !!instance.exists(identity);
    useMemo(() => {
        if (exists) {
            remaining(Object.assign(Object.assign({}, identity), { instance,
                roundToSeconds, callback: newValue => {
                    setValue(newValue);
                } }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [exists]);
    return [value];
};

const Dialog = (props) => (jsx(Dialogical, Object.assign({}, props, { instance: dialog }), void 0));
const Notification = (props) => (jsx(Dialogical, Object.assign({}, props, { instance: notification }), void 0));

export { Dialog, Dialogical, Notification, UseDialog, UseDialogic, UseNotification, useDialog, useDialogic, useDialogicState, useNotification, useRemaining };
