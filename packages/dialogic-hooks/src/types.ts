import { Dialogic } from 'dialogic';
import type { DependencyList, useEffect, useMemo, useState } from 'react';

type TUseEffect = typeof useEffect;
type TUseMemo = typeof useMemo;
type TUseState = typeof useState;
export type { DependencyList, TUseEffect, TUseMemo, TUseState };

export type UseDialogicSharedProps = {
  useEffect: TUseEffect;
  useState: TUseState;
};

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

export type SharedUseRemainingProps = {
  useMemo: TUseMemo;
  useState: TUseState;
};

export type UseRemainingProps = {
  instance: Dialogic.DialogicInstance;
  id?: string;
  spawn?: string;
  roundToSeconds?: boolean;
};
