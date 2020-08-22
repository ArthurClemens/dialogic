import React, { useEffect } from 'react';
import { createFns } from './helpers/createFns';
import { Default } from '../content/Default';
import { Buttons } from './helpers/buttons';
import { dialog, Dialog } from 'dialogic-react';

export default () => {
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
    <div className="test">
      <Buttons {...fns} />
      <div className="spawn default-spawn">
        <Dialog />
      </div>
    </div>
  );
};
