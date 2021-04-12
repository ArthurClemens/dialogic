import { UseRemainingProps, useRemainingShared } from 'dialogic-hooks';
import { useMemo, useState } from 'react';

export const useRemaining = (props: UseRemainingProps) =>
  useRemainingShared({ useState, useMemo, ...props });
