import { PropsWithChildren, DependencyList } from 'react';
import { Dialogic } from 'dialogic';

type HookUseEffect = (effect: EffectCallback, deps?: DependencyList) => void;

export type SharedUseDialogicProps = {
  useEffect: HookUseEffect;
};

export const sharedUseDialogic = ({ useEffect }: SharedUseDialogicProps) => <T>(
  allProps: UseDialogicInstanceProps<T>,
) => UseDialogicReturn;

export const sharedUseDialog = ({
  useEffect,
}: SharedUseDialogicProps & {
  dialog: Dialogic.DialogicInstance;
}) => <T>(allProps: UseDialogicInstanceProps<T>) => UseDialogicReturn;

export const sharedUseNotification = ({
  useEffect,
}: SharedUseDialogicProps & {
  notification: Dialogic.DialogicInstance;
}) => <T>(allProps: UseDialogicInstanceProps<T>) => UseDialogicReturn;

export type UseDialogicProps<T> = {
  /**
   * Condition when the instance should be shown.
   */
  isShow?: boolean;

  /**
   * For directed use only. Condition when the instance should be hidden.
   */
  isHide?: boolean;

  /**
   * Props to pass to the instance.
   */
  props?: Dialogic.Options<T>;

  /**
   * Reevaluates condition whenever one of the passed values changes.
   */
  deps?: DependencyList;

  /**
   * If true, no effects are run. Useful for conditionally disabling the hook.
   */
  isIgnore?: boolean;
};

export type UseDialogicInstanceProps<T> = UseDialogicProps<T> & {
  /**
   * Instance to show.
   */
  instance: Dialogic.DialogicInstance;
};

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
