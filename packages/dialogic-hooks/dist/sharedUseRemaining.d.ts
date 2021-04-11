import { Dialogic } from 'dialogic';

import type { TUseMemo, TUseState } from './types';

declare type SharedUseRemainingProps = {
  useMemo: TUseMemo;
  useState: TUseState;
};
declare type UseRemainingProps = {
  instance: Dialogic.DialogicInstance;
  id?: string;
  spawn?: string;
  roundToSeconds?: boolean;
};
export declare const sharedUseRemaining: ({
  useState,
  useMemo,
}: SharedUseRemainingProps) => (
  props: UseRemainingProps,
) => (number | undefined)[];
export {};
