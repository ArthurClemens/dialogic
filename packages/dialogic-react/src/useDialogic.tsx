import { dialog, notification } from 'dialogic';
import {
  TUseEffect,
  UseDialogicInstanceProps,
  UseDialogicProps,
  useDialogicShared,
} from 'dialogic-hooks';
import { PropsWithChildren, useEffect, useState } from 'react';

export const useDialogic = <T,>(props: UseDialogicInstanceProps<T>) =>
  useDialogicShared<T>({
    ...props,
    useEffect: useEffect as TUseEffect,
    useState,
  });

export const useDialog = <T,>(
  props: Omit<UseDialogicInstanceProps<T>, 'instance'>,
) =>
  useDialogicShared<T>({
    ...props,
    useEffect: useEffect as TUseEffect,
    useState,
    instance: dialog,
  });

export const useNotification = <T,>(
  props: Omit<UseDialogicInstanceProps<T>, 'instance'>,
) =>
  useDialogicShared<T>({
    ...props,
    useEffect: useEffect as TUseEffect,
    useState,
    instance: notification,
  });

/**
 * Helper component that wraps `useDialogic` to use with JSX syntax.
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
