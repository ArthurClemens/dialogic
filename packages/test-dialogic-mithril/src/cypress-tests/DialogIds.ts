import { Dialog, dialog } from 'dialogic-mithril';
import m from 'mithril';

import { Default, TDefault } from '../content/Default';
import { buttons, TButtons } from './helpers/buttons';
import { createFns } from './helpers/createFns';

export default () => {
  dialog.resetAll();
  const fns1 = createFns<TDefault>({
    instance: dialog,
    component: Default,
    className: 'dialog',
    title: 'DialogIds default',
  }) as TButtons;
  const fns2 = createFns<TDefault>({
    instance: dialog,
    component: Default,
    className: 'dialog',
    id: '1',
    title: 'DialogIds 1',
  }) as TButtons;
  const fns3 = createFns<TDefault>({
    instance: dialog,
    component: Default,
    className: 'dialog',
    id: '2',
    title: 'DialogIds 2',
  }) as TButtons;

  return {
    view: () =>
      m('.test', [
        buttons({ ...fns1 }),
        buttons({ ...fns2, id: '1' }),
        buttons({ ...fns3, id: '2' }),
        m('.spawn.default-spawn', m(Dialog)),
      ]),
  };
};
