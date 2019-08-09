import { Component } from "mithril";
export { dialog, notification } from "dialogic";

type Options = {
  id?: string;
  spawn?: string;
}

interface Dialog extends Options{}
export const Dialog: Component<Options>;

interface Notification extends Options{}
export const Notification: Component<Options>;
