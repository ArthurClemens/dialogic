import { FunctionComponent, PropsWithChildren } from 'react';
import { dialog, notification, Dialogic } from 'dialogic';

export { dialog, notification };

interface Dialog extends Dialogic.ComponentOptions {}
export const Dialog: FunctionComponent<Dialogic.ComponentOptions>;

interface Notification extends Dialogic.ComponentOptions {}
export const Notification: FunctionComponent<Dialogic.ComponentOptions>;

export const useDialogicState: UseDialogicState;
export const useRemaining: UseRemaining;
export const useMakeAppear: <T>(props: MakeAppearInstanceProps<T>) => void;
export const useMakeAppearDialog: <T>(props: MakeAppearProps<T>) => void;
export const useMakeAppearNotification: <T>(props: MakeAppearProps<T>) => void;

export const MakeAppear: <T>(
  props: PropsWithChildren<MakeAppearProps<T>>,
) => null;

export const MakeAppearDialog: <T>(
  props: PropsWithChildren<MakeAppearProps<T>>,
) => null;

export const MakeAppearNotification: <T>(
  props: PropsWithChildren<MakeAppearProps<T>>,
) => null;

export type UseDialogicState = () => void;
export type UseRemaining = ({
  instance,
  roundToSeconds,
}: {
  instance: Dialogic.DialogicInstance;
  roundToSeconds: boolean;
}) => [number | undefined];

export type MakeAppearProps<T> = {
  /**
   * Show the instance when pathname is equal to the window.location.pathname, hide when they are no longer equal.
   * When `predicate` is used, both conditions must be true.
   */
  pathname: string;

  /**
   * The current path name. Pass a custom value when using a hash router.
   * For example with React Router, pass: `history.location.pathname`.
   * Default: `window.location.pathname`.
   */
  locationPathname?: string;

  /**
   * Props to pass to the instance.
   */
  props: T & Dialogic.Options;

  /**
   * Only show the instance when the predicate is met.
   * Predicate function that returns true when the instance should appear.
   */
  predicate?: () => boolean;

  /**
   * Update the hook with these deps. Use this when the instance should appear conditionally, for instance only when
   * content exists.
   */
  deps?: React.DependencyList;

  /**
   * Function called just before instance.show() is called. This moment could be used to store the current scroll position.
   */
  beforeShow?: () => void;

  /**
   * Function called just before instance.hide() is called. This moment could be used to resstore the scroll position.
   */
  beforeHide?: () => void;
};

export type MakeAppearInstanceProps<T> = MakeAppearProps<T> & {
  /**
   * Instance to show.
   */
  instance: Dialogic.DialogicInstance;
};
