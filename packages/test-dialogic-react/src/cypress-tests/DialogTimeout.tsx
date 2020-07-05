import React, { useEffect } from 'react';
import { createFns } from './createFns';
import { Default } from '../content/Default';
import { Buttons } from './Buttons';
import { dialog, Dialog, useDialogicState } from 'dialogic-react';
import { Remaining } from './Remaining';

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
      <div className="control" data-test-id="reset-all">
        <div className="buttons">
          <button
            className="button"
            data-test-id="button-pause"
            onClick={() => dialog.pause()}
          >
            Pause
          </button>
          <button
            className="button"
            data-test-id="button-resume"
            onClick={() => dialog.resume()}
          >
            Resume
          </button>
          <button
            className="button"
            data-test-id="button-reset"
            onClick={() => dialog.resetAll()}
          >
            Reset
          </button>
        </div>
      </div>
      <div className="control" data-test-id="is-paused">
        {`Is paused: ${dialog.isPaused()}`}
      </div>
      <div className="control">
        <Remaining getRemainingFn={dialog.getRemaining} />
      </div>
      <div className="content">
        <Buttons {...fns} />
      </div>
      <div className="spawn default-spawn">
        <Dialog />
      </div>
    </div>
  );
};
