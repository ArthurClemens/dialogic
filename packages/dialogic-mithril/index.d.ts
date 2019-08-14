import { Component } from "mithril";
import { dialog, notification, Dialogic } from "dialogic";

export { dialog, notification };

interface Dialog extends Dialogic.IdentityOptions{}
export const Dialog: Component<Dialogic.IdentityOptions>;

interface Notification extends Dialogic.IdentityOptions{}
export const Notification: Component<Dialogic.IdentityOptions>;
