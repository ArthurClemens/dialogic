import React, { PropsWithChildren } from 'react';
import { dialog, notification } from 'dialogic';
import { MakeAppearProps, MakeAppearInstanceProps } from '..';
import { useMakeAppear } from './useMakeAppear';

/**
 * Helper component that wraps `useMakeAppear` to use in JSX syntax.
 */
export const MakeAppear = <T,>(
  props: PropsWithChildren<MakeAppearInstanceProps<T>>,
) => {
  useMakeAppear(props);
  return null;
};

export const MakeAppearDialog = <T,>(
  props: PropsWithChildren<MakeAppearProps<T>>,
) => <MakeAppear {...props} instance={dialog} />;

export const MakeAppearNotification = <T,>(
  props: PropsWithChildren<MakeAppearProps<T>>,
) => <MakeAppear {...props} instance={notification} />;
