import {
  show,
  hide,
  hideAll,
  resetAll,
  getCount,
  pause,
  resume,
  isPaused,
  getRemaining,
  exists,
} from './dialogic';
import { Dialogic } from '../index';

export const dialogical = ({
  ns,
  queued,
  timeout,
}: {
  ns: string;
  queued?: boolean;
  timeout?: number;
}) => {
  const defaultId = `default_${ns}`;
  const defaultSpawn = `default_${ns}`;
  const defaultDialogicOptions: Dialogic.DefaultDialogicOptions = {
    id: defaultId,
    spawn: defaultSpawn,
    ...(queued && { queued }),
    ...(timeout !== undefined && { timeout }),
  };

  return {
    // Identification
    ns,
    defaultId,
    defaultSpawn,
    // Configuration
    defaultDialogicOptions,
    // Commands
    show: show(ns)(defaultDialogicOptions),
    hide: hide(ns)(defaultDialogicOptions),
    hideAll: hideAll(ns)(defaultDialogicOptions),
    resetAll: resetAll(ns)(defaultDialogicOptions),
    // Timer commands
    pause: pause(ns)(defaultDialogicOptions),
    resume: resume(ns)(defaultDialogicOptions),
    // State
    exists: exists(ns)(defaultDialogicOptions),
    getCount: getCount(ns),
    // Timer state
    isPaused: isPaused(ns)(defaultDialogicOptions),
    getRemaining: getRemaining(ns)(defaultDialogicOptions),
  };
};
