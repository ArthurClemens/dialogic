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
    timeout: 2000,
  }) as TButtons;
  const fns2 = createFns<TDefault>({
    instance: notification,
    component: Default,
    className: 'notification',
    spawn: '2',
    title: 'Spawn',
    timeout: 2000,
  }) as TButtons;

  return {
    view: () =>
      m('.test', [
        m(
          '.section',
          { 'data-test-id': 'pause-default' },
          m(
            '.control',
            { 'data-test-id': 'pause-default' },
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
              key: 'NotificationPause',
              getRemaining: notification.getRemaining,
            }),
          ),
          m('.content', [buttons({ ...fns1 })]),
          m('.spawn.default-spawn', m(Notification)),
        ),
        m(
          '.section',
          { 'data-test-id': 'pause-id' },
          m(
            '.control',
            m('.buttons', [
              m(
                'button',
                {
                  className: 'button',
                  onclick: () => notification.pause({ spawn: '2' }),
                  'data-test-id': 'button-pause',
                },
                'Pause',
              ),
              m(
                'button',
                {
                  className: 'button',
                  onclick: () => notification.resume({ spawn: '2' }),
                  'data-test-id': 'button-resume',
                },
                'Resume',
              ),
              m(
                'button',
                {
                  className: 'button',
                  onclick: () => notification.resetAll({ spawn: '2' }),
                  'data-test-id': 'button-reset',
                },
                'Reset',
              ),
            ]),
          ),
          m(
            '.control',
            { 'data-test-id': 'is-paused' },
            `Is paused: ${notification.isPaused({ spawn: '2' })}`,
          ),
          m(
            '.control',
            m(RemainingWithAnimationFrame, {
              key: 'NotificationPause',
              getRemaining: () => notification.getRemaining({ spawn: '2' }),
            }),
          ),
          m('.content', [buttons({ ...fns2, name: 'spawn' })]),
          m('.spawn.custom-spawn', m(Notification, { spawn: '2' })),
        ),
      ]),
  };
};
