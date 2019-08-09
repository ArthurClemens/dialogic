import m, { Component } from "mithril";
import { Dialogic } from "dialogic";
import { Wrapper } from "./Wrapper";

type DialogicalFn = (type: Dialogic.DialogicInstance) => Component<Dialogic.InstanceSpawnOptions>;

export const Dialogical: DialogicalFn = type => ({
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
