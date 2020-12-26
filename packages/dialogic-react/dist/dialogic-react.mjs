import { selectors, setDomElement, showItem, hideItem, filterCandidates, states, dialog, notification } from 'dialogic';
export { dialog, notification } from 'dialogic';
import React, { useRef, useCallback, useEffect, useState, useMemo } from 'react';
import { useStream } from 'use-stream';
import { sharedUseDialogic, sharedUseDialog, sharedUseNotification, sharedUseRemaining } from 'dialogic-hooks';

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
    if (!Component) {
        throw 'Component missing in dialogic options.';
    }
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

const Dialogical = instance => props => {
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
    }, []);
    return React.createElement(Wrapper, { identityOptions: identityOptions, ns: instance.ns });
};

const useDialogic = sharedUseDialogic({ useEffect, useState });
const useDialog = sharedUseDialog({ useEffect, useState, dialog });
const useNotification = sharedUseNotification({
    useEffect,
    useState,
    notification,
});
/**
 * Helper component that wraps `useDialogic` to use with JSX syntax.
 */
const UseDialogic = (props) => {
    useDialogic(props);
    return null;
};
const UseDialog = (props) => React.createElement(UseDialogic, Object.assign({}, props, { instance: dialog }));
const UseNotification = (props) => React.createElement(UseDialogic, Object.assign({}, props, { instance: notification }));

const useRemaining = sharedUseRemaining({ useState, useMemo });

const Dialog = Dialogical(dialog);
const Notification = Dialogical(notification);

export { Dialog, Dialogical, Notification, UseDialog, UseDialogic, UseNotification, useDialog, useDialogic, useDialogicState, useNotification, useRemaining };
//# sourceMappingURL=dialogic-react.mjs.map
