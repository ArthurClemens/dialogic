import { Notification, notification, useDialogicState } from 'dialogic-react';
import React from 'react';

import { Default } from '../content/Default';
import { createFns } from './helpers/createFns';
import { PauseResumeRemaining } from './helpers/PauseResumeRemaining';
import { Remaining } from './helpers/Remaining';

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
        <Remaining instance={notification} />
      </PauseResumeRemaining>
      <PauseResumeRemaining fns={fns2} instance={notification} id="1">
        <Remaining instance={notification} id="1" />
      </PauseResumeRemaining>
      <div className="section spawn default-spawn">
        <Notification />
      </div>
    </div>
  );
};
