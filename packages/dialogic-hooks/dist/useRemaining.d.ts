import type { SharedUseRemainingProps, UseRemainingProps } from './types';

export declare const useRemainingShared: ({
  useState,
  useMemo,
  instance,
  id,
  spawn,
  roundToSeconds,
}: SharedUseRemainingProps & UseRemainingProps) => (number | undefined)[];
