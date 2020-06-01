import { selectors, setDomElement, showItem, hideItem, filterCandidates, states, dialog, notification, remaining } from 'dialogic';
export { dialog, notification } from 'dialogic';
import React, { useRef, useCallback, useEffect, useState } from 'react';
import { useStream } from 'use-stream';

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

const Instance = props => {
    const domElementRef = useRef();
    const className = props.dialogicOptions.className;
    const Component = props.dialogicOptions.component;
    const domElementCb = useCallback(node => {
        if (node !== null) {
            domElementRef.current = node;
            onMount();
        }
    }, []);
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
    return (React.createElement("div", { ref: domElementCb, className: className },
        React.createElement(Component, Object.assign({}, props.passThroughOptions, { show: show, hide: hide }))));
};

const Wrapper = props => {
    const nsOnInstanceMounted = onInstanceMounted(props.ns);
    const nsOnShowInstance = onShowInstance(props.ns);
    const nsOnHideInstance = onHideInstance(props.ns);
    const identityOptions = props.identityOptions || {};
    const filtered = filterCandidates(props.ns, selectors.getStore(), identityOptions);
    return (React.createElement(React.Fragment, null, filtered.map(item => (React.createElement(Instance, { key: item.key, identityOptions: item.identityOptions, dialogicOptions: item.dialogicOptions, passThroughOptions: item.passThroughOptions, onMount: nsOnInstanceMounted, onShow: nsOnShowInstance, onHide: nsOnHideInstance })))));
};

const useDialogicState = () => {
    // Subscribe to changes
    useStream({
        model: () => ({
            _: states,
        }),
        defer: true,
    });
};

const Dialogical = type => props => {
    useDialogicState();
    const identityOptions = {
        id: props.id || type.defaultId,
        spawn: props.spawn || type.defaultSpawn,
    };
    // Mount
    useEffect(() => {
        if (typeof props.onMount === 'function') {
            props.onMount();
        }
    }, []);
    return React.createElement(Wrapper, { identityOptions: identityOptions, ns: type.ns });
};

const useDialogic = (allProps) => {
    const { show, hide, instance, deps = [], beforeShow = () => null, beforeHide = () => null, props = {}, } = allProps;
    const showInstance = () => {
        beforeShow();
        instance.show(props);
    };
    const hideInstance = () => {
        beforeHide();
        instance.hide(props);
    };
    useEffect(() => {
        if (show !== undefined) {
            if (show) {
                showInstance();
            }
            else {
                hideInstance();
            }
        }
        return () => {
            hideInstance();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...deps, show]);
    useEffect(() => {
        if (hide !== undefined) {
            if (hide) {
                hideInstance();
            }
        }
        return () => {
            hideInstance();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...deps, hide]);
    return {
        show: showInstance,
        hide: hideInstance,
    };
};
/**
 * `useDialogic` with `instance` preset to `dialog`.
 */
const useDialog = (props) => useDialogic({ ...props, instance: dialog });
/**
 * `useDialogic` with `instance` preset to `notification`.
 */
const useNotification = (props) => useDialogic({ ...props, instance: notification });
/**
 * Helper component that wraps `useDialogic` to use in JSX syntax.
 */
const UseDialogic = (props) => {
    useDialogic(props);
    return null;
};
const UseDialog = (props) => React.createElement(UseDialogic, Object.assign({}, props, { instance: dialog }));
const UseNotification = (props) => React.createElement(UseDialogic, Object.assign({}, props, { instance: notification }));

const useRemaining = props => {
    const [value, setValue] = useState(undefined);
    const didCancelRef = useRef(false);
    useEffect(() => {
        remaining({
            instance: props.instance,
            roundToSeconds: props.roundToSeconds,
            callback: newValue => {
                if (!didCancelRef.current) {
                    setValue(newValue);
                }
            },
        });
        return () => {
            didCancelRef.current = true;
        };
    }, []);
    return [value];
};

const Dialog = Dialogical(dialog);
const Notification = Dialogical(notification);

export { Dialog, Dialogical, Notification, UseDialog, UseDialogic, UseNotification, useDialog, useDialogic, useDialogicState, useNotification, useRemaining };
