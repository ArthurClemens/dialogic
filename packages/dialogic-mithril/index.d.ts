import { Component } from 'mithril';
import { dialog, notification, Dialogic } from 'dialogic';
export { useDialogic, useDialog, useNotification } from 'dialogic-hooks';

export { dialog, notification, Dialogic };

interface Dialog extends Dialogic.ComponentOptions {}
export const Dialog: Component<Dialogic.ComponentOptions>;

interface Notification extends Dialogic.ComponentOptions {}
export const Notification: Component<Dialogic.ComponentOptions>;
