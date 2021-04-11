import { dialog, notification } from 'dialogic';
import {
  sharedUseDialog,
  sharedUseDialogic,
  sharedUseNotification,
  TUseEffect,
  UseDialogicInstanceProps,
  UseDialogicProps,
} from 'dialogic-hooks';
import { PropsWithChildren, useEffect, useState } from 'react';

export const useDialogic = sharedUseDialogic({
  useEffect: useEffect as TUseEffect,
  useState,
});
export const useDialog = sharedUseDialog({
  useEffect: useEffect as TUseEffect,
  useState,
  dialog,
});
export const useNotification = sharedUseNotification({
  useEffect: useEffect as TUseEffect,
  useState,
  notification,
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
