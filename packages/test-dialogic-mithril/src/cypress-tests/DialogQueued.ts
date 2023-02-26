import { Dialog, dialog } from 'dialogic-mithril';
import m from 'mithril';

import { Default, TDefault } from '../content/Default';
import { buttons, TButtons } from './helpers/buttons';
import { createFns } from './helpers/createFns';

export default () => {
  const fns1 = createFns<TDefault>({
    instance: dialog,
    component: Default,
    className: 'dialog',
    title: 'Default',
    queued: true,
  }) as TButtons;

  return {
    view: () =>
      m('.test', [
        m(
          '.control',
          { 'data-test-id': 'count-all' },
          `Count all: ${dialog.getCount()}`,
        ),
        m('.content', [buttons({ ...fns1 })]),
        m('.spawn.default-spawn', m(Dialog)),
      ]),
  };
};
