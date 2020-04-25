import m from 'mithril';
import { selectors, setDomElement, showItem, hideItem, filterCandidates, dialog, notification, states } from 'dialogic';
export { dialog, notification } from 'dialogic';

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
                domElement
            }
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
        view: ({ attrs }) => (m("div", { className: attrs.dialogicOptions.className }, m(attrs.dialogicOptions.component, {
            ...attrs.passThroughOptions,
            show,
            hide,
        })))
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
    }
};

const Dialogical = type => ({
    oncreate: ({ attrs }) => {
        if (typeof attrs.onMount === "function") {
            attrs.onMount();
        }
    },
    view: ({ attrs }) => {
        const identityOptions = {
            id: attrs.id || type.defaultId,
            spawn: attrs.spawn || type.defaultSpawn,
        };
        return m(Wrapper, {
            identityOptions,
            ns: type.ns,
        });
    }
});

const Dialog = Dialogical(dialog);
const Notification = Dialogical(notification);
states.map(state => (m.redraw()
// , console.log(state)
));

export { Dialog, Dialogical, Notification };
