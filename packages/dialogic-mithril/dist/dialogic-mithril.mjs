import m from 'mithril';
import { selectors, setDomElement, showItem, hideItem, filterCandidates, dialog, notification, states } from 'dialogic';
export { dialog, notification } from 'dialogic';
import { useEffect, useState, useMemo } from 'mithril-hooks';
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
            const component = attrs.dialogicOptions.component;
            if (!component) {
                throw 'Component missing in dialogic options.';
            }
            return m('div', { className: attrs.dialogicOptions.className }, m(component, {
                ...attrs.passThroughOptions,
                show,
                hide,
            }));
        },
    };
};

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

const useDialogic = sharedUseDialogic({ useEffect, useState });
const useDialog = sharedUseDialog({ useEffect, useState, dialog });
const useNotification = sharedUseNotification({
    useEffect,
    useState,
    notification,
});

const useRemaining = sharedUseRemaining({ useMemo, useState });

const Dialog = Dialogical(dialog);
const Notification = Dialogical(notification);
states.map(state => m.redraw());

export { Dialog, Dialogical, Notification, useDialog, useDialogic, useNotification, useRemaining };
//# sourceMappingURL=dialogic-mithril.mjs.map
