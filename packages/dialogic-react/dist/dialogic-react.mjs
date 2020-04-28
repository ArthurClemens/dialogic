import { selectors, setDomElement, showItem, hideItem, filterCandidates, states, remaining, dialog, notification } from 'dialogic';
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
                domElement
            }
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
    return (React.createElement(React.Fragment, null, filtered.map(item => React.createElement(Instance, { key: item.key, identityOptions: item.identityOptions, dialogicOptions: item.dialogicOptions, passThroughOptions: item.passThroughOptions, onMount: nsOnInstanceMounted, onShow: nsOnShowInstance, onHide: nsOnHideInstance }))));
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

const MakeAppear = (allProps) => {
    const { instance, appearPath, ...props } = allProps;
    useEffect(() => {
        instance.show(props);
        return () => {
            if (appearPath !== undefined) {
                if (window.location.pathname !== appearPath) {
                    instance.hide(props);
                }
            }
            else {
                instance.hide(props);
            }
        };
    }, [props, window.location]);
    return null;
};
const MakeAppearDialog = (props) => React.createElement(MakeAppear, Object.assign({}, props, { instance: dialog }));
const MakeAppearNotification = (props) => React.createElement(MakeAppear, Object.assign({}, props, { instance: notification }));

const Dialog = Dialogical(dialog);
const Notification = Dialogical(notification);

export { Dialog, Dialogical, MakeAppear, MakeAppearDialog, MakeAppearNotification, Notification, useDialogicState, useRemaining };
