import { Dialogic } from 'dialogic';

type DependencyList = ReadonlyArray<unknown>;

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
  deps?: DependencyList;

  /**
   * If true, no effects are run. Useful for conditionally disabling the hook.
   */
  isIgnore?: boolean;
};

export type UseDialogicInstanceProps<T> = UseDialogicProps<T> & {
  /**
   * Instance to show.
   */
  instance: Dialogic.DialogicInstance;
};

export type UseRemainingProps = {
  instance: Dialogic.DialogicInstance;
  id?: string;
  spawn?: string;
  roundToSeconds?: boolean;
};
