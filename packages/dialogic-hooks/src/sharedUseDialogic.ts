/* eslint-disable import/no-unresolved */
import { Dialogic } from 'dialogic';

import type { DependencyList, TUseEffect, TUseState } from './types';

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

let useDialogicCounter = 0;

type SharedUseDialogicProps = {
  useEffect: TUseEffect;
  useState: TUseState;
};

export const sharedUseDialogic = ({
  useEffect,
  useState,
}: SharedUseDialogicProps) => <T>(allProps: UseDialogicInstanceProps<T>) => {
  const {
    isIgnore,
    isShow,
    isHide,
    instance,
    deps = [],
    props = {} as T & Dialogic.Options<T>,
  } = allProps;

  // Create an id if not set.
  // This is useful for pages with multiple dialogs, where we can't expect
  // to have the user set an explicit id for each.
  // eslint-disable-next-line no-plusplus
  const [id] = useState(useDialogicCounter++);
  const augProps = {
    ...props,
    ...(props.dialogic
      ? {
          dialogic: {
            ...props.dialogic,
            id: props.dialogic.id || id,
          },
        }
      : {
          dialogic: {
            id,
          },
        }),
  };

  const showInstance = () => {
    instance.show<T>(augProps);
  };

  const hideInstance = () => {
    instance.hide<T>(augProps);
  };

  // maybe show
  useEffect(() => {
    if (isIgnore) return;
    if (isShow !== undefined) {
      if (isShow) {
        showInstance();
      } else {
        hideInstance();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, isShow]);

  // maybe hide
  useEffect(() => {
    if (isIgnore) return;
    if (isHide !== undefined) {
      if (isHide) {
        hideInstance();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, isHide]);

  // unmount
  useEffect(() => {
    if (isIgnore) return;
    // eslint-disable-next-line consistent-return
    return () => {
      hideInstance();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    show: showInstance,
    hide: hideInstance,
  };
};

/**
 * `useDialogic` with `instance` set to `dialog`.
 */
export const sharedUseDialog = ({
  useEffect,
  useState,
  dialog,
}: SharedUseDialogicProps & { dialog: Dialogic.DialogicInstance }) => <T>(
  props: UseDialogicProps<T>,
) =>
  sharedUseDialogic({ useEffect, useState })<T>({
    ...props,
    instance: dialog,
  });

/**
 * `useDialogic` with `instance` set to `notification`.
 */
export const sharedUseNotification = ({
  useEffect,
  useState,
  notification,
}: SharedUseDialogicProps & { notification: Dialogic.DialogicInstance }) => <T>(
  props: UseDialogicProps<T>,
) =>
  sharedUseDialogic({ useEffect, useState })<T>({
    ...props,
    instance: notification,
  });
