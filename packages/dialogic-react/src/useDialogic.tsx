import { useEffect, useState } from 'react';
import { dialog, notification, Dialogic } from 'dialogic';
import React, { PropsWithChildren } from 'react';
import { UseDialogicProps, UseDialogicInstanceProps } from '..';

let useDialogicCounter = 0;

export const useDialogic = <T,>(allProps: UseDialogicInstanceProps<T>) => {
  const {
    isShow,
    isHide,
    instance,
    deps = [],
    beforeShow = () => null,
    beforeHide = () => null,
    props = {} as T & Dialogic.Options<T>,
  } = allProps;

  // Use dialogic id if not set
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
    beforeShow();
    instance.show<T>(augProps);
  };

  const hideInstance = () => {
    beforeHide();
    instance.hide<T>(augProps);
  };

  useEffect(() => {
    if (isShow !== undefined) {
      if (isShow) {
        showInstance();
      } else {
        hideInstance();
      }
    }
  }, [...deps, isShow]);

  useEffect(() => {
    if (isHide !== undefined) {
      if (isHide) {
        hideInstance();
      }
    }
  }, [...deps, isHide]);

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
