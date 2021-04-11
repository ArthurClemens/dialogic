import { Notification, notification, useDialogicState } from 'dialogic-react';
import React from 'react';

import { Default } from '../content/Default';
import { createFns } from './helpers/createFns';
import { PauseResumeRemaining } from './helpers/PauseResumeRemaining';
import { RemainingWithAnimationFrame } from './helpers/RemainingWithAnimationFrame';

export default () => {
  useDialogicState();

  const commonProps = {
    instance: notification,
    component: Default,
    className: 'notification',
    timeout: 2000,
  };
  const fns1 = createFns({
    ...commonProps,
    title: 'Default',
  });
  const fns2 = createFns({
    ...commonProps,
    title: 'id1',
    id: '1',
  });

  return (
    <div className="test">
      <PauseResumeRemaining fns={fns1} instance={notification}>
        <RemainingWithAnimationFrame
          getRemainingFn={() => notification.getRemaining()}
        />
      </PauseResumeRemaining>
      <PauseResumeRemaining fns={fns2} instance={notification} id="1">
        <RemainingWithAnimationFrame
          getRemainingFn={() => notification.getRemaining({ id: '1' })}
        />
      </PauseResumeRemaining>
      <div className="section spawn default-spawn">
        <Notification />
      </div>
    </div>
  );
};
