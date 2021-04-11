import { Dialog, dialog, useDialogicState } from 'dialogic-react';
import React, { useEffect } from 'react';

import { Default } from '../content/Default';
import { Buttons } from './helpers/buttons';
import { createFns } from './helpers/createFns';

export default () => {
  useEffect(() => {
    dialog.resetAll();
  }, []);
  useDialogicState();
  const fns = createFns({
    instance: dialog,
    component: Default,
    className: 'dialog',
    title: 'Default',
    queued: true,
  });

  return (
    <div className="test">
      <div
        className="control"
        data-test-id="count-all"
      >{`Count all: ${dialog.getCount()}`}</div>
      <div className="content">
        <Buttons {...fns} />
      </div>
      <div className="spawn default-spawn">
        <Dialog />
      </div>
    </div>
  );
};
