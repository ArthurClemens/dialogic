import { useEffect } from 'react';
import { dialog, notification, Dialogic } from 'dialogic';
import React, { PropsWithChildren } from 'react';
import { UseDialogicProps, UseDialogicInstanceProps } from '..';

export const useDialogic = <T,>(allProps: UseDialogicInstanceProps<T>) => {
  const {
    show,
    hide,
    instance,
    deps = [],
    beforeShow = () => null,
    beforeHide = () => null,
    props = {} as T & Dialogic.Options,
  } = allProps;

  const showInstance = () => {
    beforeShow();
    instance.show(props);
  };

  const hideInstance = () => {
    beforeHide();
    instance.hide(props);
  };

  useEffect(() => {
    if (show !== undefined) {
      if (show) {
        showInstance();
      } else {
        hideInstance();
      }
    }
    return () => {
      hideInstance();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, show]);

  useEffect(() => {
    if (hide !== undefined) {
      if (hide) {
        hideInstance();
      }
    }
    return () => {
      hideInstance();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, hide]);

  return {
    show: showInstance,
    hide: hideInstance,
  };
};

/**
 * `useDialogic` with `instance` preset to `dialog`.
 */
export const useDialog = <T,>(props: UseDialogicInstanceProps<T>) =>
  useDialogic({ ...props, instance: dialog });

/**
 * `useDialogic` with `instance` preset to `notification`.
 */
export const useNotification = <T,>(props: UseDialogicInstanceProps<T>) =>
  useDialogic({ ...props, instance: notification });

/**
 * Helper component that wraps `useDialogic` to use in JSX syntax.
 */
export const UseDialogic = <T,>(
  props: PropsWithChildren<UseDialogicInstanceProps<T>>,
) => {
  useDialogic(props);
  return null;
};

export const UseDialog = <T,>(
  props: PropsWithChildren<UseDialogicProps<T>>,
) => <UseDialogic {...props} instance={dialog} />;

export const UseNotification = <T,>(
  props: PropsWithChildren<UseDialogicProps<T>>,
) => <UseDialogic {...props} instance={notification} />;
