import { selectors, setDomElement, showItem, hideItem, filterCandidates, dialog, notification, states } from 'dialogic';
export { Dialogic, dialog, notification } from 'dialogic';
import m from 'mithril';
import { useDialogicShared, useRemainingShared } from 'dialogic-hooks';
import { useEffect, useState, useMemo } from 'mithril-hooks';

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

const useDialogic = (props) => useDialogicShared(Object.assign(Object.assign({}, props), { useEffect,
    useState }));
const useDialog = (props) => useDialogicShared(Object.assign({ useEffect, useState, instance: dialog }, props));
const useNotification = (props) => useDialogicShared(Object.assign({ useEffect,
    useState, instance: notification }, props));

const useRemaining = (props) => useRemainingShared(Object.assign({ useState, useMemo }, props));

const Dialog = Dialogical(dialog);
const Notification = Dialogical(notification);
states.map(
// eslint-disable-next-line @typescript-eslint/no-unused-vars
state => m.redraw());

export { Dialog, Dialogical, Notification, useDialog, useDialogic, useNotification, useRemaining };
//# sourceMappingURL=dialogic-mithril.mjs.map
