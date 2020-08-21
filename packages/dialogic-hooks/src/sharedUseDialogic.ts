import { Dialogic } from 'dialogic';
import { UseDialogicInstanceProps, SharedUseDialogicProps } from '..';

export const sharedUseDialogic = ({ useEffect }: SharedUseDialogicProps) => <T>(
  allProps: UseDialogicInstanceProps<T>,
) => {
  const {
    isIgnore,
    isShow,
    isHide,
    instance,
    deps = [],
    props = {} as T & Dialogic.Options<T>,
  } = allProps;

  const showInstance = () => {
    instance.show<T>(props);
  };

  const hideInstance = () => {
    instance.hide<T>(props);
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
  dialog,
}: SharedUseDialogicProps & { dialog: Dialogic.DialogicInstance }) => <T>(
  props: UseDialogicInstanceProps<T>,
) =>
  sharedUseDialogic({ useEffect })<T>({
    ...props,
    instance: dialog,
  });

/**
 * `useDialogic` with `instance` set to `notification`.
 */
export const sharedUseNotification = ({
  useEffect,
  notification,
}: SharedUseDialogicProps & { notification: Dialogic.DialogicInstance }) => <T>(
  props: UseDialogicInstanceProps<T>,
) => sharedUseDialogic({ useEffect })<T>({ ...props, instance: notification });
