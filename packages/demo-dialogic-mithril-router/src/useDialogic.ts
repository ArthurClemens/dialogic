import { useEffect, useState } from 'mithril-hooks';
import { dialog, notification, Dialogic } from 'dialogic';

export type UseDialogicProps<T> = {
  /**
   * Condition when the instance should be shown.
   */
  isShow?: boolean;

  /**
   * For directed use only. Condition when the instance should be hidden.
   */
  isHide?: boolean;

  /**
   * Props to pass to the instance.
   */
  props?: Dialogic.Options<T>;

  /**
   * Reevaluates condition whenever one of the passed values changes.
   */
  deps?: unknown[];
};

export type UseDialogicInstanceProps<T> = UseDialogicProps<T> & {
  /**
   * Instance to show.
   */
  instance: Dialogic.DialogicInstance;
};

let useDialogicCounter = 0;

export const useDialogic = <T>(allProps: UseDialogicInstanceProps<T>) => {
  const {
    isShow,
    isHide,
    instance,
    deps = [],
    props = {} as T & Dialogic.Options<T>,
  } = allProps;

  // Use dialogic id if not set
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

  useEffect(() => {
    if (isShow !== undefined) {
      if (isShow) {
        showInstance();
      } else {
        hideInstance();
      }
    }
  }, [...deps, isShow]);

  useEffect(() => {
    if (isHide !== undefined) {
      if (isHide) {
        hideInstance();
      }
    }
  }, [...deps, isHide]);

  useEffect(() => {
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
 * `useDialogic` with `instance` preset to `dialog`.
 */
export const useDialog = <T>(props: UseDialogicInstanceProps<T>) =>
  useDialogic<T>({ ...props, instance: dialog });

/**
 * `useDialogic` with `instance` preset to `notification`.
 */
export const useNotification = <T>(props: UseDialogicInstanceProps<T>) =>
  useDialogic<T>({ ...props, instance: notification });
