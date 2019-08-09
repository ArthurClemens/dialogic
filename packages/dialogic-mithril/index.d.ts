import { Component } from "mithril";
import { dialog, notification, Dialogic } from "dialogic";

export { dialog, notification };

interface Dialog extends Dialogic.InstanceSpawnOptions{}
export const Dialog: Component<Dialogic.InstanceSpawnOptions>;

interface Notification extends Dialogic.InstanceSpawnOptions{}
export const Notification: Component<Dialogic.InstanceSpawnOptions>;
