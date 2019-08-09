import m, { Component } from "mithril";
import { filterCandidates, selectors, Dialogic } from "dialogic";
import { onInstanceMounted, onShowInstance, onHideInstance } from "./instance-events";
import { Instance } from "./Instance";

interface Wrapper extends Dialogic.DialogicalWrapperOptions{}

export const Wrapper: Component<Dialogic.DialogicalWrapperOptions> = {
  view: ({ attrs }) => {

    const nsOnInstanceMounted = onInstanceMounted(attrs.ns);
    const nsOnShowInstance = onShowInstance(attrs.ns);
    const nsOnHideInstance = onHideInstance(attrs.ns);
    
    const spawnOptions: Dialogic.SpawnOptions = attrs.spawnOptions || {} as Dialogic.SpawnOptions;
    const spawn = spawnOptions.spawn || "";
    const filtered = filterCandidates(attrs.ns, selectors.getStore(), spawn);

    return filtered.map(item =>
      m(Instance, {
        key: item.key,
        spawnOptions: item.spawnOptions,
        transitionOptions: item.transitionOptions,
        instanceOptions: item.instanceOptions,
        onMount: nsOnInstanceMounted,
        onShow: nsOnShowInstance,
        onHide: nsOnHideInstance,
      })
    );
  }
};
