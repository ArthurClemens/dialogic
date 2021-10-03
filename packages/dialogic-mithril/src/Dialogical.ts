import { Dialogic } from "dialogic";
import m, { Component } from "mithril";

import { Wrapper } from "./Wrapper";

type DialogicalFn = (
  type: Dialogic.DialogicInstance
) => Component<Dialogic.ComponentOptions>;

export const Dialogical: DialogicalFn = (instance) => ({
  oncreate: ({ attrs }) => {
    if (typeof attrs.onMount === "function") {
      attrs.onMount();
    }
  },
  view: ({ attrs }) => {
    const identityOptions = {
      id: attrs.id || instance.defaultId,
      spawn: attrs.spawn || instance.defaultSpawn,
    };
    return m(Wrapper, {
      identityOptions,
      ns: instance.ns,
    });
  },
});
