import { useEffect } from 'react';
import { dialog, notification, Dialogic } from 'dialogic';

import { MakeAppearInstanceProps } from '..';

/**
 * Hook to automatically show an instance on URL location match.
 */
export const useMakeAppear = <T>(allProps: MakeAppearInstanceProps<T>) => {
  const {
    on,
    instance,
    deps = [],
    beforeShow = () => null,
    beforeHide = () => null,
    props = {} as T & Dialogic.Options,
  } = allProps;
  const isMatch = typeof on === 'function' ? on() : on;

  const showInstance = () => {
    beforeShow();
    instance.show(props);
  };

  const hideInstance = () => {
    beforeHide();
    instance.hide(props);
  };

  useEffect(() => {
    if (isMatch) {
      showInstance();
    } else {
      hideInstance();
    }

    return () => {
      hideInstance();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, isMatch]);
};

/**
 * `useMakeAppear` with `instance` preset to `dialog`.
 */
export const useMakeAppearDialog = <T>(props: MakeAppearInstanceProps<T>) =>
  useMakeAppear({ ...props, instance: dialog });

/**
 * `useMakeAppear` with `instance` preset to `notification`.
 */
export const useMakeAppearNotification = <T>(
  props: MakeAppearInstanceProps<T>,
) => useMakeAppear({ ...props, instance: notification });
