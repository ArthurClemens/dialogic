import { selectors, setDomElement, showItem, hideItem, filterCandidates, dialog, notification, remaining, states } from 'dialogic';
export { Dialogic, dialog, notification } from 'dialogic';
import m from 'mithril';
import { useState, useEffect, useMemo } from 'mithril-hooks';

const Instance = ({ attrs: componentAttrs }) => {
    let domElement;
    const dispatchTransition = (dispatchFn) => {
        dispatchFn({
            detail: {
                identityOptions: componentAttrs.identityOptions,
                domElement,
            },
        });
    };
    const onMount = () => {
        dispatchTransition(componentAttrs.onMount);
    };
    const show = () => {
        dispatchTransition(componentAttrs.onShow);
    };
    const hide = () => {
        dispatchTransition(componentAttrs.onHide);
    };
    return {
        oncreate: (vnode) => {
            domElement = vnode.dom;
            onMount();
        },
        view: ({ attrs }) => {
            const component = attrs.dialogicOptions
                .component;
            if (!component) {
                throw new Error('Component missing in dialogic options.');
            }
            const passThroughOptions = attrs.passThroughOptions || {};
            return m('div', { className: attrs.dialogicOptions.className }, m(component, Object.assign(Object.assign({}, passThroughOptions), { show,
                hide })));
        },
    };
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

const Wrapper = {
    view: ({ attrs }) => {
        const nsOnInstanceMounted = onInstanceMounted(attrs.ns);
        const nsOnShowInstance = onShowInstance(attrs.ns);
        const nsOnHideInstance = onHideInstance(attrs.ns);
        const identityOptions = attrs.identityOptions || {};
        const filtered = filterCandidates(attrs.ns, selectors.getStore(), identityOptions);
        return filtered.map(item => m(Instance, {
            key: item.key,
            identityOptions: item.identityOptions,
            dialogicOptions: item.dialogicOptions,
            passThroughOptions: item.passThroughOptions,
            onMount: nsOnInstanceMounted,
            onShow: nsOnShowInstance,
            onHide: nsOnHideInstance,
        }));
    },
};

const Dialogical = instance => ({
    oncreate: ({ attrs }) => {
        if (typeof attrs.onMount === 'function') {
            attrs.onMount();
        }
    },
    view: ({ attrs }) => {
        const identityOptions = {
            id: attrs.id || instance.defaultId,
            spawn: attrs.spawn || instance.defaultSpawn,
        };
        return m(Wrapper, {
            identityOptions,
            ns: instance.ns,
        });
    },
});

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
const useDialog = (props) => useDialogic(Object.assign({ instance: dialog }, props));
const useNotification = (props) => useDialogic(Object.assign({ instance: notification }, props));

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

const Dialog = Dialogical(dialog);
const Notification = Dialogical(notification);
states.map(
// eslint-disable-next-line @typescript-eslint/no-unused-vars
state => m.redraw());

export { Dialog, Dialogical, Notification, useDialog, useDialogic, useNotification, useRemaining };
