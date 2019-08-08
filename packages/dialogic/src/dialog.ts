import { show as _show, hide as _hide, hideAll as _hideAll, resetAll as _resetAll, getCount as _getCount, pause as _pause, resume as _resume, isPaused as _isPaused, getRemaining as _getRemaining } from "./dialogic";
import { Dialogic } from "../index";

export const ns = "dialog";
export const defaultId = `default_${ns}`;
export const defaultSpawn = `default_${ns}`;

const defaultSpawnOptions: Dialogic.DefaultSpawnOptions = {
  id: defaultId,
  spawn: defaultSpawn,
};

const defaultTransitionOptions: Dialogic.DefaultTransitionOptions = {};

export const show = _show(ns)(defaultSpawnOptions)(defaultTransitionOptions);
export const hide = _hide(ns)(defaultSpawnOptions);
export const pause = _pause(ns)(defaultSpawnOptions);
export const resume = _resume(ns)(defaultSpawnOptions);
export const isPaused = _isPaused(ns)(defaultSpawnOptions);
export const getRemaining = _getRemaining(ns)(defaultSpawnOptions);
export const hideAll = _hideAll(ns)(defaultSpawnOptions);
export const resetAll = _resetAll(ns);
export const getCount = _getCount(ns);
