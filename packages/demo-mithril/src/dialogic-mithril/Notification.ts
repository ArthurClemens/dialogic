import m from "mithril";
import { notification } from "dialogic";
import { Wrapper } from "./Wrapper";

export { notification };

type NotificationOptions = {
  id?: string;
  spawn?: string;
}

export const Notification = ({ attrs } : { attrs: NotificationOptions }) => {
  const spawnOptions = {
    id: attrs.id || notification.defaultId,
    spawn: attrs.spawn || notification.defaultSpawn,
  };
  return {
    view: () =>
      m(Wrapper, {
        spawnOptions,
        ns: notification.ns,
      })
  };
};
