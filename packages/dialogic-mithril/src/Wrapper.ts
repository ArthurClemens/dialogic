import m, { Component } from "mithril";
import { filterCandidates, selectors, Dialogic } from "dialogic";
import { onInstanceMounted, onShowInstance, onHideInstance } from "./instanceEvents";
import { Instance } from "./Instance";

interface Wrapper extends Dialogic.DialogicalWrapperOptions{}

export const Wrapper: Component<Dialogic.DialogicalWrapperOptions> = {
  view: ({ attrs }) => {

    const nsOnInstanceMounted = onInstanceMounted(attrs.ns);
    const nsOnShowInstance = onShowInstance(attrs.ns);
    const nsOnHideInstance = onHideInstance(attrs.ns);
    
    const spawnOptions: Dialogic.SpawnOptions = attrs.spawnOptions || {} as Dialogic.SpawnOptions;
    const filtered = filterCandidates(attrs.ns, selectors.getStore(), spawnOptions);

    return filtered.map(item =>
      m(Instance, {
        key: item.key,
        spawnOptions: item.spawnOptions,
        transitionOptions: item.transitionOptions,
        passThroughOptions: item.passThroughOptions,
        onMount: nsOnInstanceMounted,
        onShow: nsOnShowInstance,
        onHide: nsOnHideInstance,
      })
    );
  }
};
