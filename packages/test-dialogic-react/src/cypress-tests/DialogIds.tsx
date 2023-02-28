import { Dialog, dialog } from 'dialogic-react';
import React from 'react';

import { Default } from '../content/Default';
import { Buttons } from './helpers/buttons';
import { createFns } from './helpers/createFns';

export default function DialogIds() {
  dialog.resetAll();
  const commonProps = {
    instance: dialog,
    component: Default,
    className: 'dialog',
  };

  const fns1 = createFns({
    ...commonProps,
    title: 'DialogIds default',
  });
  const fns2 = createFns({
    ...commonProps,
    id: '1',
    title: 'DialogIds 1',
  });
  const fns3 = createFns({
    ...commonProps,
    id: '2',
    title: 'DialogIds 2',
  });

  return (
    <div className='test'>
      <Buttons {...fns1} />
      <Buttons {...fns2} id='1' />
      <Buttons {...fns3} id='2' />
      <div className='spawn default-spawn'>
        <Dialog />
      </div>
    </div>
  );
}
