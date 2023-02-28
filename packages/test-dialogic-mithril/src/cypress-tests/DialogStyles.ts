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
    title: 'DialogStyles',
    styles: (domElement: HTMLElement) => {
      const { height } = domElement.getBoundingClientRect();
      return {
        default: {
          transition: 'all 350ms ease-in-out',
        },
        showStart: {
          opacity: '0',
          transform: `translate3d(0, ${height}px, 0)`,
        },
        showEnd: {
          opacity: '1',
          transform: 'translate3d(0, 0px,  0)',
        },
        hideEnd: {
          transitionDuration: '450ms',
          transform: `translate3d(0, ${height}px, 0)`,
          opacity: '0',
        },
      };
    },
  }) as TButtons;

  return {
    view: () =>
      m('.test', [buttons(fns), m('.spawn.default-spawn', m(Dialog))]),
  };
};
