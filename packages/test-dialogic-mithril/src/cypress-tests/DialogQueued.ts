import m from 'mithril';
import { createFns } from './createFns';
import { Default } from '../content/Default';
import { buttons } from './buttons';
import { dialog, Dialog } from 'dialogic-mithril';

export default () => {
  const fns1 = createFns({
    instance: dialog,
    component: Default,
    className: 'dialog',
    title: 'Default',
    queued: true,
  });

  return {
    view: () => {
      return m('.test', [
        m(
          '.control',
          { 'data-test-id': 'count-all' },
          `Count all: ${dialog.getCount()}`,
        ),
        m('.content', [buttons({ ...fns1 })]),
        m('.spawn.default-spawn', m(Dialog)),
      ]);
    },
  };
};
