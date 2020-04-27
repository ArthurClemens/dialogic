import React, { PropsWithChildren, useEffect } from 'react';
import { dialog, notification } from 'dialogic';
import { MakeAppearProps, MakeAppearInstanceProps } from '../index.d';

export const MakeAppear = <T,>(
  allProps: PropsWithChildren<MakeAppearProps<T>>,
) => {
  const { instance, appearPath, ...props } = allProps;
  useEffect(() => {
    instance.show(props);

    return () => {
      if (props.appearPath && window.location.pathname !== appearPath) {
        instance.hide(props);
      } else {
        instance.hide(props);
      }
    };
  }, [props, window.location]);

  return null;
};

export const MakeAppearDialog = <T,>(
  props: PropsWithChildren<MakeAppearInstanceProps<T>>,
) => <MakeAppear {...props} instance={dialog} />;

export const MakeAppearNotification = <T,>(
  props: PropsWithChildren<MakeAppearInstanceProps<T>>,
) => <MakeAppear {...props} instance={notification} />;
