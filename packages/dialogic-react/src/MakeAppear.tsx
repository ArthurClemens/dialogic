import React, { PropsWithChildren } from 'react';
import { dialog, notification } from 'dialogic';
import { MakeAppearProps, MakeAppearInstanceProps } from '../index.d';
import { useMakeAppear } from './useMakeAppear';

/**
 * Helper component that wraps `useMakeAppear` to use in JSX syntax.
 */
export const MakeAppear = <T,>(
  allProps: PropsWithChildren<MakeAppearInstanceProps<T>>,
) => {
  const { instance, pathname, predicate, deps, props } = allProps;

  useMakeAppear({
    instance,
    props,
    predicate,
    pathname,
    deps,
  });

  return null;
};

export const MakeAppearDialog = <T,>(
  props: PropsWithChildren<MakeAppearProps<T>>,
) => <MakeAppear {...props} instance={dialog} />;

export const MakeAppearNotification = <T,>(
  props: PropsWithChildren<MakeAppearProps<T>>,
) => <MakeAppear {...props} instance={notification} />;
