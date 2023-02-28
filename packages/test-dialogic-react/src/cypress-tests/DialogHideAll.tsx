import { Dialog, dialog, useDialogicState } from 'dialogic-react';
import React from 'react';

import { Default } from '../content/Default';
import { Buttons } from './helpers/buttons';
import { createFns } from './helpers/createFns';

export default function DialogHideAll() {
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

  const hideAllStyles = {
    showEnd: {
      opacity: '1',
    },
    hideEnd: {
      transition: 'all 450ms ease-in-out',
      opacity: '0',
    },
  };

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
      <div className='control' data-test-id='hide-all'>
        <div className='buttons'>
          <button
            type='button'
            className='button'
            data-test-id='button-hide-all'
            onClick={() => dialog.hideAll()}
          >
            Hide all
          </button>
          <button
            type='button'
            className='button'
            data-test-id='button-hide-all-simultaneously'
            onClick={() => dialog.hideAll({ styles: hideAllStyles })}
          >
            Hide all simultaneously
          </button>
          <button
            type='button'
            className='button'
            data-test-id='button-hide-all-id'
            onClick={() => dialog.hideAll({ id: '1' })}
          >
            Hide all with id
          </button>
          <button
            type='button'
            className='button'
            data-test-id='button-hide-all-spawn'
            onClick={() => dialog.hideAll({ spawn: '1' })}
          >
            Hide all with spawn
          </button>
          <button
            type='button'
            className='button'
            data-test-id='button-hide-all-spawn-id'
            onClick={() => dialog.hideAll({ id: '1', spawn: '1' })}
          >
            Hide all with spawn and id
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
