import {
  Dialogic,
  hideItem,
  selectors,
  setDomElement,
  showItem,
} from 'dialogic';

export const handleDispatch =
  (ns: string) =>
  (event: Dialogic.InstanceEvent, fn: Dialogic.InitiateItemTransitionFn) => {
    // Update dispatching item:
    const maybeItem = selectors.find(ns, event.detail.identityOptions);
    if (maybeItem.just) {
      setDomElement(event.detail.domElement, maybeItem.just);
    }
    // Find item to transition:
    const maybeTransitioningItem = selectors.find(
      ns,
      event.detail.identityOptions,
    );
    if (maybeTransitioningItem.just) {
      fn(maybeTransitioningItem.just);
    }
  };

export const onInstanceMounted =
  (ns: string) => (event: Dialogic.InstanceEvent) =>
    handleDispatch(ns)(event, showItem);

export const onShowInstance = (ns: string) => (event: Dialogic.InstanceEvent) =>
  handleDispatch(ns)(event, showItem);

export const onHideInstance = (ns: string) => (event: Dialogic.InstanceEvent) =>
  handleDispatch(ns)(event, hideItem);
