import { Dialog, dialog } from 'dialogic-mithril';
import m from 'mithril';

import { Default, TDefault } from '../content/Default';
import { buttons, TButtons } from './helpers/buttons';
import { createFns } from './helpers/createFns';

export default () => {
  const fns = createFns<TDefault>({
    instance: dialog,
    component: Default,
    className: 'dialog-delay',
    title: 'DialogClassDelay',
  }) as TButtons;

  return {
    view: () =>
      m('.test', [buttons(fns), m('.spawn.default-spawn', m(Dialog))]),
  };
};
