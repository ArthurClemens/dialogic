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
    className: 'dialog',
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
          `Exists any: ${dialog.exists().toString()}`,
        ),
        m(
          '.control',
          { 'data-test-id': 'count-id' },
          `Exists id: ${dialog.exists({ id: '1' }).toString()}`,
        ),
        m(
          '.control',
          { 'data-test-id': 'count-spawn' },
          `Exists spawn: ${dialog.exists({ spawn: '1' }).toString()}`,
        ),
        m(
          '.control',
          { 'data-test-id': 'count-spawn-id' },
          `Exists spawn, id: ${dialog
            .exists({ spawn: '1', id: '1' })
            .toString()}`,
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
