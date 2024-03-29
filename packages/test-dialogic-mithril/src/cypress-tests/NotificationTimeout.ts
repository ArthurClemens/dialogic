import { Notification, notification } from 'dialogic-mithril';
import m from 'mithril';

import { Default, TDefault } from '../content/Default';
import { buttons, TButtons } from './helpers/buttons';
import { createFns } from './helpers/createFns';
import { RemainingWithAnimationFrame } from './helpers/RemainingWithAnimationFrame';

export default () => {
  const fns1 = createFns<TDefault>({
    instance: notification,
    component: Default,
    className: 'notification',
    title: 'Default',
    timeout: 1000,
  }) as TButtons;
  const fns2 = createFns<TDefault>({
    instance: notification,
    component: Default,
    className: 'notification',
    title: 'Timeout: 0',
    timeout: 0,
  }) as TButtons;

  return {
    view: () =>
      m('.test', [
        m(
          '.control',
          { 'data-test-id': 'reset-all' },
          m('.buttons', [
            m(
              'button',
              {
                className: 'button',
                onclick: () => notification.pause(),
                'data-test-id': 'button-pause',
              },
              'Pause',
            ),
            m(
              'button',
              {
                className: 'button',
                onclick: () => notification.resume(),
                'data-test-id': 'button-resume',
              },
              'Resume',
            ),
            m(
              'button',
              {
                className: 'button',
                onclick: () => notification.resetAll(),
                'data-test-id': 'button-reset',
              },
              'Reset',
            ),
          ]),
        ),
        m(
          '.control',
          { 'data-test-id': 'is-paused' },
          `Is paused: ${notification.isPaused()}`,
        ),
        m(
          '.control',
          m(RemainingWithAnimationFrame, {
            key: 'NotificationTimeout',
            getRemaining: notification.getRemaining,
          }),
        ),
        m('.content', [
          buttons({ ...fns1 }),
          buttons({ ...fns2, id: '1', name: 'zero-timeout' }),
        ]),
        m('.spawn.default-spawn', m(Notification)),
      ]),
  };
};
