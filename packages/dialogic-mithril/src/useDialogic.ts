import { dialog, Dialogic, notification } from 'dialogic';
import type { UseDialogicInstanceProps } from 'dialogic-hooks';
import { useEffect, useState } from 'mithril-hooks';

let useDialogicCounter = 0;

export const useDialogic = <T>({
  isIgnore,
  isShow,
  isHide,
  instance,
  deps = [],
  props = {} as T & Dialogic.Options<T>,
}: UseDialogicInstanceProps<T>) => {
  // Create an id if not set.
  // This is useful for pages with multiple dialogs, where we can't expect
  // to have the user set an explicit id for each.
  // eslint-disable-next-line no-plusplus
  const [id] = useState(useDialogicCounter++);

  const augProps = {
    ...props,
    ...(props?.dialogic
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
    if (isIgnore) {
      return;
    }
    if (isShow !== undefined) {
      if (isShow) {
        showInstance();
      } else {
        hideInstance();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, isShow]);

  // maybe hide
  useEffect(() => {
    if (isIgnore) {
      return;
    }
    if (isHide !== undefined) {
      if (isHide) {
        hideInstance();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, isHide]);

  // unmount
  useEffect(() => {
    if (isIgnore) {
      return undefined;
    }
    // eslint-disable-next-line consistent-return
    return () => {
      hideInstance();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    show: showInstance,
    hide: hideInstance,
  };
};

export const useDialog = <T>(
  props: Omit<UseDialogicInstanceProps<T>, 'instance'>,
) => useDialogic<T>({ instance: dialog, ...props });

export const useNotification = <T>(
  props: Omit<UseDialogicInstanceProps<T>, 'instance'>,
) =>
  useDialogic<T>({
    instance: notification,
    ...props,
  });
