import { Dialog, dialog } from 'dialogic-mithril';
import m from 'mithril';

import { Default } from '../content/Default';
import { buttons } from './helpers/buttons';
import { createFns } from './helpers/createFns';

export default () => {
  dialog.resetAll();
  const fns = createFns({
    instance: dialog,
    component: Default,
    className: 'dialog',
    title: 'DialogClassName',
  });

  return {
    view: () =>
      m('.test', [buttons(fns), m('.spawn.default-spawn', m(Dialog))]),
  };
};
