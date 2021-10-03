/// <reference types="../../node_modules/@types/react" />
import type { UseDialogicInstanceProps, UseDialogicProps } from "dialogic-hooks";
import React, { PropsWithChildren } from "react";
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
export declare const UseDialogic: <T>(props: React.PropsWithChildren<UseDialogicInstanceProps<T>>) => null;
export declare const UseDialog: <T>(props: React.PropsWithChildren<UseDialogicProps<T>>) => JSX.Element;
export declare const UseNotification: <T>(props: React.PropsWithChildren<UseDialogicProps<T>>) => JSX.Element;
