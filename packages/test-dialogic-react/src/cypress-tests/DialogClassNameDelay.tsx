import React from 'react';
import { createFns } from './helpers/createFns';
import { Default } from '../content/Default';
import { Buttons } from './helpers/buttons';
import { dialog, Dialog } from 'dialogic-react';

export default () => {
  const fns = createFns({
    instance: dialog,
    component: Default,
    className: 'dialog-delay',
    title: 'DialogClassDelay',
  });

  return (
    <div className="test">
      <Buttons {...fns} />
      <div className="spawn default-spawn">
        <Dialog />
      </div>
    </div>
  );
};
