import { showItem, hideItem, selectors } from "dialogic";

export const handleDispatch = (ns) => (event, fn) => {
  // Update dispatching item:
  const maybeItem = selectors.find(ns, event.detail.spawnOptions);
  if (maybeItem.just) {
    maybeItem.just.instanceTransitionOptions = event.detail.transitionOptions;
  }
  // Find item to transition:
  const maybeTransitioningItem = selectors.find(ns, event.detail.spawnOptions);
  if (maybeTransitioningItem.just) {
    fn(maybeTransitioningItem.just, ns);
  }
};

export const onInstanceMounted = (ns) => (event) =>
  handleDispatch(ns)(event, showItem);
  
export const onShowInstance = (ns) => (event) =>
  handleDispatch(ns)(event, showItem);

export const onHideInstance = (ns) => (event) =>
  handleDispatch(ns)(event, hideItem);
