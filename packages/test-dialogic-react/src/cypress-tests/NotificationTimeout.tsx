import React from 'react';
import { createFns } from './helpers/createFns';
import { Default } from '../content/Default';
import { notification, Notification, useDialogicState } from 'dialogic-react';
import { RemainingWithAnimationFrame } from './helpers/RemainingWithAnimationFrame';
import { Buttons } from './helpers/buttons';

export default () => {
  useDialogicState();

  const commonProps = {
    instance: notification,
    component: Default,
    className: 'notification',
  };

  const fns1 = createFns({
    ...commonProps,
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
        <RemainingWithAnimationFrame
          getRemainingFn={notification.getRemaining}
        />
      </div>
      <div className="content">
        <Buttons {...fns1} />
        <Buttons {...fns2} id="1" name="zero-timeout" />
      </div>
      <div className="spawn default-spawn">
        <Notification />
      </div>
    </div>
    // <div className="test">
    //   <PauseResumeRemaining fns={fns1} instance={notification}>
    //     <RemainingWithAnimationFrame
    //       getRemainingFn={() => notification.getRemaining()}
    //     />
    //   </PauseResumeRemaining>
    //   <PauseResumeRemaining
    //     fns={fns2}
    //     instance={notification}
    //     id="1"
    //     buttonName="zero-timeout"
    //   >
    //     <RemainingWithAnimationFrame
    //       getRemainingFn={() => notification.getRemaining({ id: '1' })}
    //     />
    //   </PauseResumeRemaining>
    //   <div className="section spawn default-spawn">
    //     <Notification />
    //   </div>
    // </div>
  );
};
