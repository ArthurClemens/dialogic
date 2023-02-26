import { Dialog, dialog } from 'dialogic-react';
import React, { useEffect } from 'react';

import { Default } from '../content/Default';
import { Buttons } from './helpers/buttons';
import { createFns } from './helpers/createFns';

export default function DialogClassName() {
  useEffect(() => {
    dialog.resetAll();
  }, []);
  const fns = createFns({
    instance: dialog,
    component: Default,
    className: 'dialog',
    title: 'DialogClassName',
  });

  return (
    <div className='test'>
      <Buttons {...fns} />
      <div className='spawn default-spawn'>
        <Dialog />
      </div>
    </div>
  );
}
