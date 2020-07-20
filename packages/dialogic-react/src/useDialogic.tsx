import { useEffect } from 'react';
import { dialog, notification, Dialogic } from 'dialogic';
import React, { PropsWithChildren } from 'react';
import { UseDialogicProps, UseDialogicInstanceProps } from '..';

export const useDialogic = <T,>(allProps: UseDialogicInstanceProps<T>) => {
  const {
    isShow,
    isHide,
    instance,
    deps = [],
    props = {} as T & Dialogic.Options<T>,
  } = allProps;

  const showInstance = () => {
    instance.show<T>(props);
  };

  const hideInstance = () => {
    instance.hide<T>(props);
  };

  // maybe show
  useEffect(() => {
    if (isShow !== undefined) {
      if (isShow) {
        showInstance();
      } else {
        hideInstance();
      }
    }
  }, [...deps, isShow]);

  // maybe hide
  useEffect(() => {
    if (isHide !== undefined) {
      if (isHide) {
        hideInstance();
      }
    }
  }, [...deps, isHide]);

  // unmount
  useEffect(() => {
    return () => {
      hideInstance();
    };
  }, []);

  return {
    show: showInstance,
    hide: hideInstance,
  };
};

/**
 * `useDialogic` with `instance` preset to `dialog`.
 */
export const useDialog = <T,>(props: UseDialogicInstanceProps<T>) =>
  useDialogic<T>({ ...props, instance: dialog });

/**
 * `useDialogic` with `instance` preset to `notification`.
 */
export const useNotification = <T,>(props: UseDialogicInstanceProps<T>) =>
  useDialogic<T>({ ...props, instance: notification });

/**
 * Helper component that wraps `useDialogic` to use in JSX syntax.
 */
export const UseDialogic = <T,>(
  props: PropsWithChildren<UseDialogicInstanceProps<T>>,
) => {
  useDialogic<T>(props);
  return null;
};

export const UseDialog = <T,>(
  props: PropsWithChildren<UseDialogicProps<T>>,
) => <UseDialogic {...props} instance={dialog} />;

export const UseNotification = <T,>(
  props: PropsWithChildren<UseDialogicProps<T>>,
) => <UseDialogic {...props} instance={notification} />;
