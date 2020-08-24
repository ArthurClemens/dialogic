import m from 'mithril';
import { createFns } from './helpers/createFns';
import { Default } from '../content/Default';
import { buttons } from './helpers/buttons';
import { dialog, Dialog } from 'dialogic-mithril';

export default () => {
  const fns = createFns({
    instance: dialog,
    component: Default,
    className: 'dialog-delay',
    title: 'DialogClassDelay',
  });

  return {
    view: () => {
      return m('.test', [buttons(fns), m('.spawn.default-spawn', m(Dialog))]);
    },
  };
};
