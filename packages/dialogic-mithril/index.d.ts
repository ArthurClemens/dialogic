import { Component } from 'mithril';
import { dialog, notification, Dialogic } from 'dialogic';
import { UseDialogicProps, UseRemainingProps } from 'dialogic-hooks';

export { dialog, notification, Dialogic };

interface Dialog extends Dialogic.ComponentOptions {}
export const Dialog: Component<Dialogic.ComponentOptions>;

interface Notification extends Dialogic.ComponentOptions {}
export const Notification: Component<Dialogic.ComponentOptions>;

export const useDialogic: <T>(allProps: UseDialogicProps<T>) => unknown;
export const useDialog: <T>(allProps: UseDialogicProps<T>) => unknown;
export const useNotification: <T>(allProps: UseDialogicProps<T>) => unknown;
export const useRemaining: <T>(
  props: UseRemainingProps,
) => (number | undefined)[];
