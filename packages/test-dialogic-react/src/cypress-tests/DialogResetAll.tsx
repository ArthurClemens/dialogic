import { Dialog, dialog, useDialogicState } from 'dialogic-react';
import React from 'react';

import { Default } from '../content/Default';
import { Buttons } from './helpers/buttons';
import { createFns } from './helpers/createFns';

export default function DialogResetAll() {
  useDialogicState();
  const fns1 = createFns({
    instance: dialog,
    component: Default,
    className: 'dialog',
    title: 'Default',
  });
  const fns2 = createFns({
    instance: dialog,
    component: Default,
    className: 'dialog dialog-delay',
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

  return (
    <div className='test'>
      <div
        className='control'
        data-test-id='count-all'
      >{`Count all: ${dialog.getCount()}`}</div>
      <div
        className='control'
        data-test-id='count-id'
      >{`Count id: ${dialog.getCount({ id: '1' })}`}</div>
      <div
        className='control'
        data-test-id='count-spawn'
      >{`Count spawn: ${dialog.getCount({ spawn: '1' })}`}</div>
      <div
        className='control'
        data-test-id='count-spawn-id'
      >{`Count spawn, id: ${dialog.getCount({ spawn: '1', id: '1' })}`}</div>
      <div className='control' data-test-id='reset-all'>
        <div className='buttons'>
          <button
            type='button'
            className='button'
            data-test-id='button-reset-all'
            onClick={() => dialog.resetAll()}
          >
            Reset all
          </button>
          <button
            type='button'
            className='button'
            data-test-id='button-reset-all-id'
            onClick={() => dialog.resetAll({ id: '1' })}
          >
            Reset all with id
          </button>
          <button
            type='button'
            className='button'
            data-test-id='button-reset-all-spawn'
            onClick={() => dialog.resetAll({ spawn: '1' })}
          >
            Reset all with spawn
          </button>
          <button
            type='button'
            className='button'
            data-test-id='button-reset-all-spawn-id'
            onClick={() => dialog.resetAll({ id: '1', spawn: '1' })}
          >
            Reset all with spawn and id
          </button>
        </div>
      </div>
      <div className='content'>
        <Buttons {...fns1} />
        <Buttons {...fns2} id='1' />
        <Buttons {...fns3} spawn='1' />
        <Buttons {...fns4} spawn='1' id='1' />
      </div>
      <div className='spawn default-spawn'>
        <Dialog />
      </div>
      <div className='spawn custom-spawn'>
        <Dialog spawn='1' />
      </div>
    </div>
  );
}
