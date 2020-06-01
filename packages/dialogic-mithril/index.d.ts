import { Component } from 'mithril';
import { dialog, notification, Dialogic } from 'dialogic';

export { dialog, notification };

interface Dialog extends Dialogic.ComponentOptions {}
export const Dialog: Component<Dialogic.ComponentOptions>;

interface Notification extends Dialogic.ComponentOptions {}
export const Notification: Component<Dialogic.ComponentOptions>;
