import { show, hide, toggle, hideAll, resetAll, getCount, pause, resume, isPaused, getRemaining, exists } from "./dialogic";
import { Dialogic } from "../index";

export const dialogical = ({ ns, queued, timeout } : { ns: string, queued?: boolean, timeout?: number }) => {
  const defaultId = `default_${ns}`;
  const defaultSpawn = `default_${ns}`;
  const defaultOptions: Dialogic.DefaultOptions = {
    id: defaultId,
    spawn: defaultSpawn,
    dialogic: {
      ...(queued && { queued }),
      ...(timeout !== undefined && { timeout }),
    }
  };

  return {
    // Identification
    ns,
    defaultId,
    defaultSpawn,
    // Configuration
    defaultOptions,
    // Commands
    show: show(ns)(defaultOptions),
    toggle: toggle(ns)(defaultOptions),
    hide: hide(ns)(defaultOptions),
    hideAll: hideAll(ns),
    resetAll: resetAll(ns),
    // Timer commands
    pause: pause(ns)(defaultOptions),
    resume: resume(ns)(defaultOptions),
    // State
    exists: exists(ns)(defaultOptions),
    getCount: getCount(ns),
    // Timer state
    isPaused: isPaused(ns)(defaultOptions),
    getRemaining: getRemaining(ns)(defaultOptions),
  }
};
