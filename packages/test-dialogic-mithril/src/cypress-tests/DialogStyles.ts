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
    title: 'DialogStyles',
    styles: (domElement: HTMLElement) => {
      const height = domElement.getBoundingClientRect().height;
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
  });

  return {
    view: () => {
      return m('.test', [buttons(fns), m('.spawn.default-spawn', m(Dialog))]);
    },
  };
};
