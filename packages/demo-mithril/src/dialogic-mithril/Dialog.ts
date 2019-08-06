import m from "mithril";
import { dialog } from "dialogic";
import { Wrapper } from "./Wrapper";

export { dialog };

type DialogOptions = {
  id?: string;
  spawn?: string;
}

export const Dialog = ({ attrs } : { attrs: DialogOptions }) => {
  const spawnOptions = {
    id: attrs.id || dialog.defaultId,
    spawn: attrs.spawn || dialog.defaultSpawn,
  };
  return {
    view: () =>
      m(Wrapper, {
        spawnOptions,
        ns: dialog.ns,
      })
  };
};
