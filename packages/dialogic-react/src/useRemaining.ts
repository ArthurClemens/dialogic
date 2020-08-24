import { useState, useMemo } from 'react';

import { sharedUseRemaining } from 'dialogic-hooks';

export const useRemaining = sharedUseRemaining({ useState, useMemo });
