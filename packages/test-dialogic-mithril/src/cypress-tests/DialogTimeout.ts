import { Dialog, dialog } from 'dialogic-mithril';
import m from 'mithril';

import { Default, TDefault } from '../content/Default';
import { buttons, TButtons } from './helpers/buttons';
import { createFns } from './helpers/createFns';
import { RemainingWithAnimationFrame } from './helpers/RemainingWithAnimationFrame';

export default () => {
  dialog.resetAll();
  const fns1 = createFns<TDefault>({
    instance: dialog,
    component: Default,
    className: 'dialog',
    title: 'Default',
    timeout: 2000,
  }) as TButtons;

  return {
    view: () =>
      m('.test', { key: new Date().getTime() }, [
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
      ]),
  };
};
