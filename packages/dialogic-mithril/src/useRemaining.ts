import { UseRemainingProps, useRemainingShared } from 'dialogic-hooks';
import { useMemo, useState } from 'mithril-hooks';

export const useRemaining = (props: UseRemainingProps) =>
  useRemainingShared({ useState, useMemo, ...props });
