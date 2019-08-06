import { showItem, hideItem, selectors } from "dialogic";
import { Dialogic } from "dialogic";

type InstanceEvent = {
  detail: {
    spawnOptions: Dialogic.SpawnOptions;
    transitionOptions: Dialogic.TransitionOptions;
  }
}

export const handleDispatch = (ns: string) => (event: InstanceEvent, fn: Dialogic.InitiateItemTransitionFn) => {
  // Update dispatching item:
  const maybeItem: Dialogic.MaybeItem = selectors.find(ns, event.detail.spawnOptions);
  if (maybeItem.just) {
    maybeItem.just.instanceTransitionOptions = event.detail.transitionOptions;
  }
  // Find item to transition:
  const maybeTransitioningItem: Dialogic.MaybeItem = selectors.find(ns, event.detail.spawnOptions);
  if (maybeTransitioningItem.just) {
    fn(maybeTransitioningItem.just, ns);
  }
};

export const onInstanceMounted = (ns: string) => (event: InstanceEvent) =>
  handleDispatch(ns)(event, showItem);
  
export const onShowInstance = (ns: string) => (event: InstanceEvent) =>
  handleDispatch(ns)(event, showItem);

export const onHideInstance = (ns: string) => (event: InstanceEvent) =>
  handleDispatch(ns)(event, hideItem);
