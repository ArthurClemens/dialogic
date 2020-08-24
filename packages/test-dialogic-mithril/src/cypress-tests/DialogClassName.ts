import m from 'mithril';
import { createFns } from './helpers/createFns';
import { Default } from '../content/Default';
import { buttons } from './helpers/buttons';
import { dialog, Dialog } from 'dialogic-mithril';

export default () => {
  dialog.resetAll();
  const fns = createFns({
    instance: dialog,
    component: Default,
    className: 'dialog',
    title: 'DialogClassName',
  });

  return {
    view: () => {
      return m('.test', [buttons(fns), m('.spawn.default-spawn', m(Dialog))]);
    },
  };
};
