import { dialog, notification } from 'dialogic';
import { UseDialogicInstanceProps, useDialogicShared } from 'dialogic-hooks';
import { useEffect, useState } from 'mithril-hooks';

export const useDialogic = <T>(props: UseDialogicInstanceProps<T>) =>
  useDialogicShared<T>({
    ...props,
    useEffect,
    useState,
  });

export const useDialog = <T>(
  props: Omit<UseDialogicInstanceProps<T>, 'instance'>,
) => useDialogicShared<T>({ useEffect, useState, instance: dialog, ...props });

export const useNotification = <T>(
  props: Omit<UseDialogicInstanceProps<T>, 'instance'>,
) =>
  useDialogicShared<T>({
    useEffect,
    useState,
    instance: notification,
    ...props,
  });
