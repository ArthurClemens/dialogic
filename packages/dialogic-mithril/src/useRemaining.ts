import { sharedUseRemaining } from 'dialogic-hooks';
import { useMemo, useState } from 'mithril-hooks';

export const useRemaining = sharedUseRemaining({ useMemo, useState });
