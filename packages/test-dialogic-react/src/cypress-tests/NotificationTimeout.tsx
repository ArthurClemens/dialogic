import React from 'react';
import { createFns } from './createFns';
import { Default } from '../content/Default';
import { Buttons } from './Buttons';
import { notification, Notification } from 'dialogic-react';
import { Remaining } from './Remaining';

export default () => {
  const fns1 = createFns({
    instance: notification,
    component: Default,
    className: 'notification',
    title: 'Default',
    timeout: 2000,
  });
  const fns2 = createFns({
    instance: notification,
    component: Default,
    className: 'notification',
    title: 'Timeout: 0',
    timeout: 0,
  });

  return (
    <div className="test">
      <div className="control" data-test-id="reset-all">
        <div className="buttons">
          <button
            className="button"
            data-test-id="button-pause"
            onClick={() => notification.pause()}
          >
            Pause
          </button>
          <button
            className="button"
            data-test-id="button-resume"
            onClick={() => notification.resume()}
          >
            Resume
          </button>
          <button
            className="button"
            data-test-id="button-reset"
            onClick={() => notification.resetAll()}
          >
            Reset
          </button>
        </div>
      </div>
      <div className="control" data-test-id="is-paused">
        {`Is paused: ${notification.isPaused()}`}
      </div>
      <div className="control">
        <Remaining getRemainingFn={notification.getRemaining} />
      </div>
      <div className="content">
        <Buttons {...fns1} />
        <Buttons {...fns2} id="1" name="zero-timeout" />
      </div>
      <div className="spawn default-spawn">
        <Notification />
      </div>
    </div>
  );
};
