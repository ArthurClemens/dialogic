import { useEffect, useState } from 'react';
import { dialog, notification } from 'dialogic';

import { MakeAppearInstanceProps } from '..';

/**
 * Hook to automatically show an instance on URL location match.
 * Usage:
 
 import { dialog, useMakeAppear } from 'dialogic-react';

 const content = 'Some async loaded content';
 const dialogPath = '/login';
 const dialogBasePath = '/';

 useMakeAppear({
   pathname: dialogPath,
   instance: dialog,
   predicate: () => !!content,
   deps: [content],
   props: {
     dialogic: {
      component: LoginDialog,
      className: 'dialogic',
    },
    returnPath: dialogBasePath,
    content,
   }
 })
 */

export const useMakeAppear = <T>(allProps: MakeAppearInstanceProps<T>) => {
  const {
    pathname,
    locationPathname = window.location.pathname,
    instance,
    predicate = () => true,
    deps = [],
    beforeShow = () => null,
    beforeHide = () => null,
    props,
  } = allProps;
  const [isHiding, setIsHiding] = useState(false);

  const showInstance = () => {
    setIsHiding(false);
    beforeShow();
    instance.show(props);
  };

  const hideInstance = ({ force }: { force?: boolean } = {}) => {
    if (force || !isHiding) {
      setIsHiding(true);
      beforeHide();
      instance.hide(props);
    }
  };

  useEffect(() => {
    if (locationPathname === pathname) {
      if (predicate()) {
        setIsHiding(false);
        showInstance();
      }
    } else {
      hideInstance();
    }

    return () => {
      hideInstance({ force: true });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, locationPathname]);
};

/**
 * `useMakeAppear` with `instance` preset to `dialog`.
 * Usage:
 
 import { useMakeAppearDialog } from 'dialogic-react';

 const content = 'Some async loaded content';
 const dialogPath = '/login';
 const dialogBasePath = '/';

 useMakeAppear({
   pathname: dialogPath,
   predicate: () => !!content,
   deps: [content],
   props: {
     dialogic: {
      component: LoginDialog,
      className: 'dialogic',
    },
    returnPath: dialogBasePath,
    content,
   }
 })
 */
export const useMakeAppearDialog = <T>(props: MakeAppearInstanceProps<T>) =>
  useMakeAppear({ ...props, instance: dialog });

/**
 * `useMakeAppear` with `instance` preset to `notification`.
 */
export const useMakeAppearNotification = <T>(
  props: MakeAppearInstanceProps<T>,
) => useMakeAppear({ ...props, instance: notification });
