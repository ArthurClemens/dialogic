import { useMemo, useState } from 'mithril-hooks';

import { sharedUseRemaining } from 'dialogic-hooks';

export const useRemaining = sharedUseRemaining({ useMemo, useState });
