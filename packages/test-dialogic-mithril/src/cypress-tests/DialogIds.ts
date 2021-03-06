import m from 'mithril';
import { createFns } from './helpers/createFns';
import { Default } from '../content/Default';
import { buttons } from './helpers/buttons';
import { dialog, Dialog } from 'dialogic-mithril';

export default () => {
  dialog.resetAll();
  const fns1 = createFns({
    instance: dialog,
    component: Default,
    className: 'dialog',
    title: 'DialogIds default',
  });
  const fns2 = createFns({
    instance: dialog,
    component: Default,
    className: 'dialog',
    id: '1',
    title: 'DialogIds 1',
  });
  const fns3 = createFns({
    instance: dialog,
    component: Default,
    className: 'dialog',
    id: '2',
    title: 'DialogIds 2',
  });

  return {
    view: () => {
      return m('.test', [
        buttons({ ...fns1 }),
        buttons({ ...fns2, id: '1' }),
        buttons({ ...fns3, id: '2' }),
        m('.spawn.default-spawn', m(Dialog)),
      ]);
    },
  };
};
