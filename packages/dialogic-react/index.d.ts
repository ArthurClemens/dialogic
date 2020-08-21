import { PropsWithChildren } from 'react';
import { dialog, notification, Dialogic } from 'dialogic';
export { useDialogic, useDialog, useNotification } from 'dialogic-hooks';

export { dialog, notification, Dialogic };

interface Dialog extends Dialogic.ComponentOptions {}
export const Dialog: (props: Dialogic.ComponentOptions) => JSX.Element;

interface Notification extends Dialogic.ComponentOptions {}
export const Notification: (props: Dialogic.ComponentOptions) => JSX.Element;

export const useDialogicState: UseDialogicState;
export const useRemaining: UseRemaining;

type UseDialogicReturn = {
  /**
   * Calls dialogic.show() on the instance with the props initially passed to useDialogic.
   */
  show: () => void;

  /**
   * Calls dialogic.hide() on the instance with the props initially passed to useDialogic.
   */
  hide: () => void;
};

export const UseDialogic: <T>(
  props: PropsWithChildren<UseDialogicProps<T>>,
) => null;

export const UseDialog: <T>(
  props: PropsWithChildren<UseDialogicProps<T>>,
) => null;

export const UseNotification: <T>(
  props: PropsWithChildren<UseDialogicProps<T>>,
) => null;

export type UseDialogicState = () => void;
export type UseRemaining = ({
  instance,
  roundToSeconds,
}: {
  instance: Dialogic.DialogicInstance;
  roundToSeconds: boolean;
}) => [number | undefined];
