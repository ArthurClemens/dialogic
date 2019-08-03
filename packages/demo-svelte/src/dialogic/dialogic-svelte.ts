import { showItem, hideItem, selectors } from "dialogic";
import { Dialogic } from "dialogic";

export const handleDispatch = (ns: string) => (event: Dialogic.TInstanceEvent, fn: Dialogic.TInitiateItemTransitionFn) => {
  // Update dispatching item:
  const maybeItem: Dialogic.TMaybeItem = selectors.find(event.detail.spawnOptions, ns);
  if (maybeItem.just) {
    maybeItem.just.instanceTransitionOptions = event.detail.transitionOptions;
  }
  // Find item to transition:
  const maybeTransitioningItem: Dialogic.TMaybeItem = selectors.find(event.detail.spawnOptions, ns);
  if (maybeTransitioningItem.just) {
    fn(maybeTransitioningItem.just, ns);
  }
};

export const onInstanceMounted = (ns: string) => (event: Dialogic.TInstanceEvent) =>
  handleDispatch(ns)(event, showItem);
  
export const onShowInstance = (ns: string) => (event: Dialogic.TInstanceEvent) =>
  handleDispatch(ns)(event, showItem);

export const onHideInstance = (ns: string) => (event: Dialogic.TInstanceEvent) =>
  handleDispatch(ns)(event, hideItem);
