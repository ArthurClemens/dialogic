import { useEffect, useState } from 'react';
import { dialog, notification } from 'dialogic';
import React, { PropsWithChildren } from 'react';
import {
  UseDialogicProps,
  UseDialogicInstanceProps,
  sharedUseDialogic,
  sharedUseDialog,
  sharedUseNotification,
} from 'dialogic-hooks';

export const useDialogic = sharedUseDialogic({ useEffect, useState });
export const useDialog = sharedUseDialog({ useEffect, useState, dialog });
export const useNotification = sharedUseNotification({
  useEffect,
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
