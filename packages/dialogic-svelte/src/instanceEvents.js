import { showItem, hideItem, selectors, setDomElement } from "dialogic";

export const handleDispatch = (ns) => (event, fn) => {
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

export const onInstanceMounted = (ns) => (event) =>
  handleDispatch(ns)(event, showItem);
  
export const onShowInstance = (ns) => (event) =>
  handleDispatch(ns)(event, showItem);

export const onHideInstance = (ns) => (event) =>
  handleDispatch(ns)(event, hideItem);
