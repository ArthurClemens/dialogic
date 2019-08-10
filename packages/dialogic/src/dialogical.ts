import { show, hide, hideAll, resetAll, getCount, pause, resume, isPaused, getRemaining, isDisplayed } from "./dialogic";
import { Dialogic } from "../index";

export const dialogical = ({ ns, queued, timeout } : { ns: string, queued?: boolean, timeout?: number }) => {
  const defaultId = `default_${ns}`;
  const defaultSpawn = `default_${ns}`;
  const defaultSpawnOptions: Dialogic.DefaultSpawnOptions = {
    id: defaultId,
    spawn: defaultSpawn,
    queued
  };

  const defaultTransitionOptions: Dialogic.DefaultTransitionOptions = {
    timeout
  };

  return {
    // Identification
    ns,
    defaultId,
    defaultSpawn,
    // Configuration
    defaultSpawnOptions,
    // Commands
    show : show(ns)(defaultSpawnOptions)(defaultTransitionOptions),
    hide: hide(ns)(defaultSpawnOptions),
    pause: pause(ns)(defaultSpawnOptions),
    resume: resume(ns)(defaultSpawnOptions),
    hideAll: hideAll(ns)(defaultSpawnOptions),
    resetAll: resetAll(ns),
    // State
    isDisplayed: isDisplayed(ns)(defaultSpawnOptions),
    getCount: getCount(ns),
    // Timer state
    isPaused: isPaused(ns)(defaultSpawnOptions),
    getRemaining: getRemaining(ns)(defaultSpawnOptions),
  }
};
