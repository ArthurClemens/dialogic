import m from "mithril";
import { filter, selectors, Dialogic } from "dialogic";
import { onInstanceMounted, onShowInstance, onHideInstance } from "./instance-events";
import { Instance } from "./Instance";

type WrapperOptions = {
  ns: string;
  spawnOptions: Dialogic.SpawnOptions;
}

export const Wrapper = {
  view: ({ attrs } : { attrs: WrapperOptions }) => {

    const nsOnInstanceMounted = onInstanceMounted(attrs.ns);
    const nsOnShowInstance = onShowInstance(attrs.ns);
    const nsOnHideInstance = onHideInstance(attrs.ns);
    
    const spawnOptions: Dialogic.SpawnOptions = attrs.spawnOptions || {} as Dialogic.SpawnOptions;
    const spawn = spawnOptions.spawn || "";
    const filtered = filter(attrs.ns, selectors.getStore(), spawn);
    console.log("Wrapper", "spawnOptions", spawnOptions, "filtered", filtered);
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
