import { sharedUseRemaining } from 'dialogic-hooks';
// eslint-disable-next-line import/no-unresolved
import { useMemo, useState } from 'react';

export const useRemaining = sharedUseRemaining({ useState, useMemo });
