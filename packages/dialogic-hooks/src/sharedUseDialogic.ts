import { Dialogic } from 'dialogic';
import { UseDialogicInstanceProps, SharedUseDialogicProps } from '..';

let useDialogicCounter = 0;

export const sharedUseDialogic = ({
  useEffect,
  useState,
}: SharedUseDialogicProps) => <T>(allProps: UseDialogicInstanceProps<T>) => {
  const {
    isIgnore,
    isShow,
    isHide,
    instance,
    deps = [],
    props = {} as T & Dialogic.Options<T>,
  } = allProps;

  // Create an id if not set.
  // This is useful for pages with multiple dialogs, where we can't expect
  // to have the user set an explicit id for each.
  const [id] = useState(useDialogicCounter++);
  const augProps = {
    ...props,
    ...(props.dialogic
      ? {
          dialogic: {
            ...props.dialogic,
            id: props.dialogic.id || id,
          },
        }
      : {
          dialogic: {
            id,
          },
        }),
  };

  const showInstance = () => {
    instance.show<T>(augProps);
  };

  const hideInstance = () => {
    instance.hide<T>(augProps);
  };

  // maybe show
  useEffect(() => {
    if (isIgnore) return;
    if (isShow !== undefined) {
      if (isShow) {
        showInstance();
      } else {
        hideInstance();
      }
    }
  }, [...deps, isShow]);

  // maybe hide
  useEffect(() => {
    if (isIgnore) return;
    if (isHide !== undefined) {
      if (isHide) {
        hideInstance();
      }
    }
  }, [...deps, isHide]);

  // unmount
  useEffect(() => {
    if (isIgnore) return;
    return () => {
      hideInstance();
    };
  }, []);

  return {
    show: showInstance,
    hide: hideInstance,
  };
};

/**
 * `useDialogic` with `instance` set to `dialog`.
 */
export const sharedUseDialog = ({
  useEffect,
  useState,
  dialog,
}: SharedUseDialogicProps & { dialog: Dialogic.DialogicInstance }) => <T>(
  props: UseDialogicInstanceProps<T>,
) =>
  sharedUseDialogic({ useEffect, useState })<T>({
    ...props,
    instance: dialog,
  });

/**
 * `useDialogic` with `instance` set to `notification`.
 */
export const sharedUseNotification = ({
  useEffect,
  useState,
  notification,
}: SharedUseDialogicProps & { notification: Dialogic.DialogicInstance }) => <T>(
  props: UseDialogicInstanceProps<T>,
) =>
  sharedUseDialogic({ useEffect, useState })<T>({
    ...props,
    instance: notification,
  });
