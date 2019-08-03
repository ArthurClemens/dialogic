import { show as _show, hide as _hide, hideAll as _hideAll, resetAll as _resetAll, count as _count, pause as _pause, resume as _resume } from "./dialogic";

import { Dialogic } from "../index";

export const ns = "notification";
export const defaultId = `default_${ns}`;
export const defaultSpawn = `default_${ns}`;

const defaultSpawnOptions: Dialogic.TDefaultSpawnOptions = {
  id: defaultId,
  queued: true,
  spawn: defaultSpawn,
};

const defaultTransitionOptions: Dialogic.TDefaultTransitionOptions = {
  timeout: 3000,
};

export const show = _show(ns, defaultTransitionOptions, defaultSpawnOptions);
export const hide = _hide(ns, defaultSpawnOptions);
export const pause = _pause(ns, defaultSpawnOptions);
export const resume = _resume(ns, defaultSpawnOptions);
export const resetAll = _resetAll(ns);
export const hideAll = _hideAll(ns, defaultSpawnOptions);
export const count = _count(ns);
