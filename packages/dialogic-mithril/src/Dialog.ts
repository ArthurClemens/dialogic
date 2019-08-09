import m from "mithril";
import { dialog } from "dialogic";
import { Wrapper } from "./Wrapper";

export { dialog };

type DialogOptions = {
  id?: string;
  spawn?: string;
}

export const Dialog = {
  view: ({ attrs } : { attrs: DialogOptions }) => {
    const spawnOptions = {
      id: attrs.id || dialog.defaultId,
      spawn: attrs.spawn || dialog.defaultSpawn,
    };
    console.log("Dialog", "spawnOptions", spawnOptions, "dialog.ns", dialog.ns);
    return m(Wrapper, {
      spawnOptions,
      ns: dialog.ns,
    });
  }
};
