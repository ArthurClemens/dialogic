import { Dialog, dialog } from 'dialogic-mithril';
import m from 'mithril';

import { Default, TDefault } from '../content/Default';
import { buttons, TButtons } from './helpers/buttons';
import { createFns } from './helpers/createFns';

export default () => {
  const fns1 = createFns<TDefault>({
    instance: dialog,
    component: Default,
    className: 'dialog',
    title: 'Default',
  }) as TButtons;
  const fns2 = createFns<TDefault>({
    instance: dialog,
    component: Default,
    className: 'dialog dialog-delay',
    id: '1',
    title: 'ID',
  }) as TButtons;
  const fns3 = createFns<TDefault>({
    instance: dialog,
    component: Default,
    className: 'dialog',
    spawn: '1',
    title: 'Spawn',
  }) as TButtons;
  const fns4 = createFns<TDefault>({
    instance: dialog,
    component: Default,
    className: 'dialog',
    spawn: '1',
    id: '1',
    title: 'Spawn and ID',
  }) as TButtons;

  return {
    view: () =>
      m('.test', [
        m(
          '.control',
          { 'data-test-id': 'count-all' },
          `Count all: ${dialog.getCount()}`,
        ),
        m(
          '.control',
          { 'data-test-id': 'count-id' },
          `Count id: ${dialog.getCount({ id: '1' })}`,
        ),
        m(
          '.control',
          { 'data-test-id': 'count-spawn' },
          `Count spawn: ${dialog.getCount({ spawn: '1' })}`,
        ),
        m(
          '.control',
          { 'data-test-id': 'count-spawn-id' },
          `Count spawn, id: ${dialog.getCount({ spawn: '1', id: '1' })}`,
        ),
        m(
          '.control',
          { 'data-test-id': 'reset-all' },
          m('.buttons', [
            m(
              'button',
              {
                className: 'button',
                onclick: () => dialog.resetAll(),
                'data-test-id': 'button-reset-all',
              },
              'Reset all',
            ),
            m(
              'button',
              {
                className: 'button',
                onclick: () => dialog.resetAll({ id: '1' }),
                'data-test-id': 'button-reset-all-id',
              },
              'Reset all with id',
            ),
            m(
              'button',
              {
                className: 'button',
                onclick: () => dialog.resetAll({ spawn: '1' }),
                'data-test-id': 'button-reset-all-spawn',
              },
              'Reset all with spawn',
            ),
            m(
              'button',
              {
                className: 'button',
                onclick: () => dialog.resetAll({ id: '1', spawn: '1' }),
                'data-test-id': 'button-reset-all-spawn-id',
              },
              'Reset all with spawn and id',
            ),
          ]),
        ),
        m('.content', [
          buttons({ ...fns1 }),
          buttons({ ...fns2, id: '1' }),
          buttons({ ...fns3, spawn: '1' }),
          buttons({ ...fns4, spawn: '1', id: '1' }),
        ]),
        m('.spawn.default-spawn', m(Dialog)),
        m('.spawn.custom-spawn', m(Dialog, { spawn: '1' })),
      ]),
  };
};
