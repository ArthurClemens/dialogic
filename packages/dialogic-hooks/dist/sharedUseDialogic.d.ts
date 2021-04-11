/// <reference types="react" />
import { Dialogic } from 'dialogic';

import type { DependencyList, TUseEffect, TUseState } from './types';

export declare type UseDialogicProps<T> = {
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
export declare type UseDialogicInstanceProps<T> = UseDialogicProps<T> & {
  /**
   * Instance to show.
   */
  instance: Dialogic.DialogicInstance;
};
declare type SharedUseDialogicProps = {
  useEffect: TUseEffect;
  useState: TUseState;
};
export declare const sharedUseDialogic: ({
  useEffect,
  useState,
}: SharedUseDialogicProps) => <T>(
  allProps: UseDialogicInstanceProps<T>,
) => {
  show: () => void;
  hide: () => void;
};
/**
 * `useDialogic` with `instance` set to `dialog`.
 */
export declare const sharedUseDialog: ({
  useEffect,
  useState,
  dialog,
}: SharedUseDialogicProps & {
  dialog: Dialogic.DialogicInstance;
}) => <T>(
  props: UseDialogicInstanceProps<T>,
) => {
  show: () => void;
  hide: () => void;
};
/**
 * `useDialogic` with `instance` set to `notification`.
 */
export declare const sharedUseNotification: ({
  useEffect,
  useState,
  notification,
}: SharedUseDialogicProps & {
  notification: Dialogic.DialogicInstance;
}) => <T>(
  props: UseDialogicInstanceProps<T>,
) => {
  show: () => void;
  hide: () => void;
};
export {};
