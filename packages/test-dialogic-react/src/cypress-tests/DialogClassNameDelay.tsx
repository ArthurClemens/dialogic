import { Dialog, dialog } from 'dialogic-react';
import React from 'react';

import { Default } from '../content/Default';
import { Buttons } from './helpers/buttons';
import { createFns } from './helpers/createFns';

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
