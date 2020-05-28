import { FunctionComponent, PropsWithChildren } from 'react';
import { dialog, notification, Dialogic } from 'dialogic';

export { dialog, notification };

interface Dialog extends Dialogic.ComponentOptions {}
export const Dialog: FunctionComponent<Dialogic.ComponentOptions>;

interface Notification extends Dialogic.ComponentOptions {}
export const Notification: FunctionComponent<Dialogic.ComponentOptions>;

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
export const useDialogic: <T>(
  props: UseDialogicInstanceProps<T>,
) => UseDialogicReturn;
export const useDialog: <T>(props: UseDialogicProps<T>) => UseDialogicReturn;
export const useNotification: <T>(
  props: UseDialogicProps<T>,
) => UseDialogicReturn;

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

export type UseDialogicProps<T> = {
  /**
   * Condition when the instance should be shown.
   */
  show?: boolean;

  /**
   * For directed use only. Condition when the instance should be hidden.
   */
  hide?: boolean;

  /**
   * Props to pass to the instance.
   */
  props?: T & Dialogic.Options;

  /**
   * Reevaluates condition whenever one of the passed values changes.
   */
  deps?: React.DependencyList;

  /**
   * Function called just before instance.show() is called. This moment could be used to store the current scroll position.
   */
  beforeShow?: () => void;

  /**
   * Function called just before instance.hide() is called. This moment could be used to restore the scroll position.
   */
  beforeHide?: () => void;
};

export type UseDialogicInstanceProps<T> = UseDialogicProps<T> & {
  /**
   * Instance to show.
   */
  instance: Dialogic.DialogicInstance;
};
