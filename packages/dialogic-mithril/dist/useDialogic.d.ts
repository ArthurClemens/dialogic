export declare const useDialogic: <T>(
  allProps: import('dialogic-hooks').UseDialogicInstanceProps<T>,
) => {
  show: () => void;
  hide: () => void;
};
export declare const useDialog: <T>(
  props: T,
) => {
  show: () => void;
  hide: () => void;
};
export declare const useNotification: <T>(
  props: T,
) => {
  show: () => void;
  hide: () => void;
};
