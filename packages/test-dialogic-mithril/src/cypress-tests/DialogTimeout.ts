import m from 'mithril';
import { createFns } from './helpers/createFns';
import { Default } from '../content/Default';
import { buttons } from './helpers/buttons';
import { dialog, Dialog } from 'dialogic-mithril';
import { RemainingWithAnimationFrame } from './helpers/RemainingWithAnimationFrame';

export default () => {
  dialog.resetAll();
  const fns1 = createFns({
    instance: dialog,
    component: Default,
    className: 'dialog',
    title: 'Default',
    timeout: 2000,
  });

  return {
    view: () => {
      return m('.test', { key: new Date().getTime() }, [
        m(
          '.control',
          { 'data-test-id': 'reset-all' },
          m('.buttons', [
            m(
              'button',
              {
                className: 'button',
                onclick: () => dialog.pause(),
                'data-test-id': 'button-pause',
              },
              'Pause',
            ),
            m(
              'button',
              {
                className: 'button',
                onclick: () => dialog.resume(),
                'data-test-id': 'button-resume',
              },
              'Resume',
            ),
            m(
              'button',
              {
                className: 'button',
                onclick: () => dialog.resetAll(),
                'data-test-id': 'button-reset',
              },
              'Reset',
            ),
          ]),
        ),
        m(
          '.control',
          { 'data-test-id': 'is-paused' },
          `Is paused: ${dialog.isPaused()}`,
        ),
        m(
          '.control',
          m(RemainingWithAnimationFrame, {
            key: 'DialogTimeout',
            getRemaining: dialog.getRemaining,
          }),
        ),
        m('.content', [buttons({ ...fns1 })]),
        m('.spawn.default-spawn', m(Dialog)),
      ]);
    },
  };
};
