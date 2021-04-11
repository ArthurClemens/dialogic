import { UseDialogicInstanceProps, UseDialogicProps } from 'dialogic-hooks';
import { PropsWithChildren } from 'react';

export declare const useDialogic: <T>(
  allProps: UseDialogicInstanceProps<T>,
) => {
  show: () => void;
  hide: () => void;
};
export declare const useDialog: <T>(
  props: UseDialogicInstanceProps<T>,
) => {
  show: () => void;
  hide: () => void;
};
export declare const useNotification: <T>(
  props: UseDialogicInstanceProps<T>,
) => {
  show: () => void;
  hide: () => void;
};
/**
 * Helper component that wraps `useDialogic` to use with JSX syntax.
 */
export declare const UseDialogic: <T>(
  props: PropsWithChildren<UseDialogicInstanceProps<T>>,
) => null;
export declare const UseDialog: <T>(
  props: PropsWithChildren<UseDialogicProps<T>>,
) => JSX.Element;
export declare const UseNotification: <T>(
  props: PropsWithChildren<UseDialogicProps<T>>,
) => JSX.Element;
