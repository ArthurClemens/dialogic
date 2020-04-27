import React, { PropsWithChildren, useEffect } from 'react';
import { dialog, notification, Dialogic } from 'dialogic';

type MakeAppearProps<T> = {
  instance: Dialogic.DialogicInstance;
} & Dialogic.Options &
  T;

export const MakeAppear = <T,>(
  allProps: PropsWithChildren<MakeAppearProps<T>>,
) => {
  const { instance, ...props } = allProps;
  useEffect(() => {
    instance.show(props);

    return () => {
      instance.hide(props);
    };
  }, [props, window.location]);

  return null;
};

type MakeAppearInstanceProps<T> = Dialogic.Options & T;

export const MakeAppearDialog = <T,>(
  props: PropsWithChildren<MakeAppearInstanceProps<T>>,
) => <MakeAppear {...props} instance={dialog} />;

export const MakeAppearNotification = <T,>(
  props: PropsWithChildren<MakeAppearInstanceProps<T>>,
) => <MakeAppear {...props} instance={notification} />;
