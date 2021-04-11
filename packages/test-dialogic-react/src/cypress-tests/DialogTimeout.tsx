import { Dialog, dialog, useDialogicState } from 'dialogic-react';
import React, { useEffect } from 'react';

import { Default } from '../content/Default';
import { createFns } from './helpers/createFns';
import { PauseResumeRemaining } from './helpers/PauseResumeRemaining';
import { RemainingWithAnimationFrame } from './helpers/RemainingWithAnimationFrame';

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
    timeout: 2000,
  });

  return (
    <div className="test">
      <PauseResumeRemaining fns={fns} instance={dialog}>
        <RemainingWithAnimationFrame
          getRemainingFn={() => dialog.getRemaining()}
        />
      </PauseResumeRemaining>
      <div className="section spawn default-spawn">
        <Dialog />
      </div>
    </div>
  );
};
