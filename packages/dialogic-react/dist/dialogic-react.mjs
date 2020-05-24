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

/**
 * Hook to automatically show an instance on URL location match.
 * Usage:
 
 import { dialog, useMakeAppear } from 'dialogic-react';

 const content = 'Some async loaded content';
 const dialogPath = '/login';
 const dialogBasePath = '/';

 useMakeAppear({
   pathname: dialogPath,
   instance: dialog,
   predicate: () => !!content,
   deps: [content],
   props: {
     dialogic: {
      component: LoginDialog,
      className: 'dialogic',
    },
    returnPath: dialogBasePath,
    content,
   }
 })
 */
const useMakeAppear = (allProps) => {
    const { pathname, locationPathname = window.location.pathname, instance, predicate = () => true, deps = [], props, } = allProps;
    const [isHiding, setIsHiding] = useState(false);
    const showInstance = () => {
        setIsHiding(false);
        instance.show(props);
    };
    const hideInstance = ({ force } = {}) => {
        if (force || !isHiding) {
            setIsHiding(true);
            instance.hide(props);
        }
    };
    useEffect(() => {
        if (locationPathname === pathname) {
            if (predicate()) {
                setIsHiding(false);
                showInstance();
            }
        }
        else {
            hideInstance();
        }
        return () => {
            hideInstance({ force: true });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...deps, locationPathname]);
};
/**
 * `useMakeAppear` with `instance` preset to `dialog`.
 * Usage:
 
 import { useMakeAppearDialog } from 'dialogic-react';

 const content = 'Some async loaded content';
 const dialogPath = '/login';
 const dialogBasePath = '/';

 useMakeAppear({
   pathname: dialogPath,
   predicate: () => !!content,
   deps: [content],
   props: {
     dialogic: {
      component: LoginDialog,
      className: 'dialogic',
    },
    returnPath: dialogBasePath,
    content,
   }
 })
 */
const useMakeAppearDialog = (props) => useMakeAppear({ ...props, instance: dialog });
/**
 * `useMakeAppear` with `instance` preset to `notification`.
 */
const useMakeAppearNotification = (props) => useMakeAppear({ ...props, instance: notification });

/**
 * Helper component that wraps `useMakeAppear` to use in JSX syntax.
 */
const MakeAppear = (allProps) => {
    const { instance, pathname, locationPathname, predicate, deps, props, } = allProps;
    useMakeAppear({
        instance,
        props,
        predicate,
        pathname,
        locationPathname,
        deps,
    });
    return null;
};
const MakeAppearDialog = (props) => React.createElement(MakeAppear, Object.assign({}, props, { instance: dialog }));
const MakeAppearNotification = (props) => React.createElement(MakeAppear, Object.assign({}, props, { instance: notification }));

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

export { Dialog, Dialogical, MakeAppear, MakeAppearDialog, MakeAppearNotification, Notification, useDialogicState, useMakeAppear, useMakeAppearDialog, useMakeAppearNotification, useRemaining };
