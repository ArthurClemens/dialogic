import DialogClassName from './cypress-tests/DialogClassName.svelte';
import DialogClassNameDelay from './cypress-tests/DialogClassNameDelay.svelte';
import DialogCount from './cypress-tests/DialogCount.svelte';
import DialogExists from './cypress-tests/DialogExists.svelte';
import DialogHideAll from './cypress-tests/DialogHideAll.svelte';
import DialogIds from './cypress-tests/DialogIds.svelte';
import DialogQueued from './cypress-tests/DialogQueued.svelte';
import DialogResetAll from './cypress-tests/DialogResetAll.svelte';
import DialogStyles from './cypress-tests/DialogStyles.svelte';
import DialogTimeout from './cypress-tests/DialogTimeout.svelte';
import LibBulmaDialog from './cypress-tests/lib-bulma/Dialog.svelte';
import LibMaterialIODialog from './cypress-tests/lib-material-io/Dialog.svelte';
import NotificationCount from './cypress-tests/NotificationCount.svelte';
import NotificationPause from './cypress-tests/NotificationPause.svelte';
import NotificationTimeout from './cypress-tests/NotificationTimeout.svelte';
import Home from './Home.svelte';

export default {
  '/': Home,
  '/DialogClassName': DialogClassName,
  '/DialogClassNameDelay': DialogClassNameDelay,
  '/DialogStyles': DialogStyles,
  '/DialogIds': DialogIds,
  '/DialogExists': DialogExists,
  '/DialogCount': DialogCount,
  '/DialogHideAll': DialogHideAll,
  '/DialogResetAll': DialogResetAll,
  '/DialogTimeout': DialogTimeout,
  '/DialogQueued': DialogQueued,
  '/NotificationCount': NotificationCount,
  '/NotificationPause': NotificationPause,
  '/NotificationTimeout': NotificationTimeout,
  '/LibBulmaDialog': LibBulmaDialog,
  '/LibMaterialIODialog': LibMaterialIODialog,
};
