import { Dialog, dialog } from 'dialogic-mithril';
import m from 'mithril';

import { Default, TDefault } from '../content/Default';
import { buttons, TButtons } from './helpers/buttons';
import { createFns } from './helpers/createFns';

export default () => {
  dialog.resetAll();
  const fns = createFns<TDefault>({
    instance: dialog,
    component: Default,
    className: 'dialog',
    title: 'DialogClassName',
  }) as TButtons;

  return {
    view: () =>
      m('.test', [buttons(fns), m('.spawn.default-spawn', m(Dialog))]),
  };
};
