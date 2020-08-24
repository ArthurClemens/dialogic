import m from 'mithril';
import { createFns } from './helpers/createFns';
import { Default } from '../content/Default';
import { buttons } from './helpers/buttons';
import { dialog, Dialog } from 'dialogic-mithril';

export default () => {
  const fns1 = createFns({
    instance: dialog,
    component: Default,
    className: 'dialog',
    title: 'Default',
  });
  const fns2 = createFns({
    instance: dialog,
    component: Default,
    className: 'dialog',
    id: '1',
    title: 'ID',
  });
  const fns3 = createFns({
    instance: dialog,
    component: Default,
    className: 'dialog',
    spawn: '1',
    title: 'Spawn',
  });
  const fns4 = createFns({
    instance: dialog,
    component: Default,
    className: 'dialog',
    spawn: '1',
    id: '1',
    title: 'Spawn and ID',
  });
  const fns5 = createFns({
    instance: dialog,
    component: Default,
    className: 'dialog',
    spawn: '2',
    queued: true,
    title: 'Spawn queued',
  });

  return {
    view: () => {
      return m('.test', [
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
          { 'data-test-id': 'count-spawn-queued' },
          `Count spawn, queued: ${dialog.getCount({ spawn: '2' })}`,
        ),
        m('.content', [
          buttons({ ...fns1 }),
          buttons({ ...fns2, id: '1' }),
          buttons({ ...fns3, spawn: '1' }),
          buttons({ ...fns4, spawn: '1', id: '1' }),
          buttons({ ...fns5, spawn: '5', name: 'queued' }),
        ]),
        m('.spawn.default-spawn', m(Dialog)),
        m('.spawn.custom-spawn', m(Dialog, { spawn: '1' })),
        m('.spawn.custom-spawn', m(Dialog, { spawn: '2' })),
      ]);
    },
  };
};
