import { showItem, hideItem, selectors, setDomElement, Dialogic } from "dialogic";

export const handleDispatch = (ns: string) => (event: Dialogic.InstanceEvent, fn: Dialogic.InitiateItemTransitionFn) => {
  // Update dispatching item:
  const maybeItem: Dialogic.MaybeItem = selectors.find(ns, event.detail.spawnOptions);
  if (maybeItem.just) {
    setDomElement(event.detail.domElement, maybeItem.just);
  }
  // Find item to transition:
  const maybeTransitioningItem: Dialogic.MaybeItem = selectors.find(ns, event.detail.spawnOptions);
  if (maybeTransitioningItem.just) {
    fn(maybeTransitioningItem.just);
  }
};

export const onInstanceMounted = (ns: string) => (event: Dialogic.InstanceEvent) =>
  handleDispatch(ns)(event, showItem);
  
export const onShowInstance = (ns: string) => (event: Dialogic.InstanceEvent) =>
  handleDispatch(ns)(event, showItem);

export const onHideInstance = (ns: string) => (event: Dialogic.InstanceEvent) =>
  handleDispatch(ns)(event, hideItem);
