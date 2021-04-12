import { UseDialogicInstanceProps } from 'dialogic-hooks';

export declare const useDialogic: <T>(
  props: UseDialogicInstanceProps<T>,
) => {
  show: () => void;
  hide: () => void;
};
export declare const useDialog: <T>(
  props: Omit<UseDialogicInstanceProps<T>, 'instance'>,
) => {
  show: () => void;
  hide: () => void;
};
export declare const useNotification: <T>(
  props: Omit<UseDialogicInstanceProps<T>, 'instance'>,
) => {
  show: () => void;
  hide: () => void;
};
