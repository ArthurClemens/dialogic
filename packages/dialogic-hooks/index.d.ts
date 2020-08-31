import {
  PropsWithChildren,
  DependencyList,
  Dispatch,
  SetStateAction,
  useState,
  useMemo,
  useEffect,
} from 'react';
import { Dialogic } from 'dialogic';

export type SharedUseDialogicProps = {
  useEffect: typeof useEffect;
  useState: typeof useState;
};

export type SharedUseRemainingProps = {
  useMemo: typeof useMemo;
  useState: typeof useState;
};

export const sharedUseDialogic = (props: SharedUseDialogicProps) => <T>(
  allProps: UseDialogicInstanceProps<T>,
) => UseDialogicReturn;

export const sharedUseDialog = (
  props: SharedUseDialogicProps & {
    dialog: Dialogic.DialogicInstance;
  },
) => <T>(allProps: UseDialogicInstanceProps<T>) => UseDialogicReturn;

export const sharedUseNotification = (
  props: SharedUseDialogicProps & {
    notification: Dialogic.DialogicInstance;
  },
) => <T>(allProps: UseDialogicInstanceProps<T>) => UseDialogicReturn;

export const sharedUseRemaining = ({
  useMemo,
  useState,
}: SharedUseRemainingProps) => (props: UseRemainingProps) => [
  number | undefined,
];

export type UseRemainingProps = {
  instance: Dialogic.DialogicInstance;
  id?: string;
  spawn?: string;
  roundToSeconds?: boolean;
};

export type UseRemaining = (props: UseRemainingProps) => (number | undefined)[];

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
