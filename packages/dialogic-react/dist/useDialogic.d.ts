/// <reference types="../../node_modules/@types/react" />
import type { UseDialogicInstanceProps, UseDialogicProps } from 'dialogic-hooks';
import { PropsWithChildren } from 'react';
export declare const useDialogic: <T>({ isIgnore, isShow, isHide, instance, deps, props, }: UseDialogicInstanceProps<T>) => {
    show: () => void;
    hide: () => void;
};
export declare const useDialog: <T>(props: Omit<UseDialogicInstanceProps<T>, "instance">) => {
    show: () => void;
    hide: () => void;
};
export declare const useNotification: <T>(props: Omit<UseDialogicInstanceProps<T>, "instance">) => {
    show: () => void;
    hide: () => void;
};
/**
 * Helper component that wraps `useDialogic` to use with JSX syntax.
 */
export declare function UseDialogic<T>(props: PropsWithChildren<UseDialogicInstanceProps<T>>): null;
export declare function UseDialog<T>(props: PropsWithChildren<UseDialogicProps<T>>): JSX.Element;
export declare function UseNotification<T>(props: PropsWithChildren<UseDialogicProps<T>>): JSX.Element;
