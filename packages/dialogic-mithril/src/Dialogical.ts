import m, { Component } from "mithril";
import { Dialogic } from "dialogic";
import { Wrapper } from "./Wrapper";

type DialogicalFn = (type: Dialogic.DialogicInstance) => Component<Dialogic.IdentityOptions>;

export const Dialogical: DialogicalFn = type => ({
  oncreate: ({ attrs }) => {
    if (typeof attrs.onMount === "function") {
      attrs.onMount();
    }
  },
  view: ({ attrs }) => {
    const spawnOptions = {
      id: attrs.id || type.defaultId,
      spawn: attrs.spawn || type.defaultSpawn,
    };
    return m(Wrapper, {
      spawnOptions,
      ns: type.ns,
    });
  }
});
