import React, { ReactNode } from 'react';
import { createFns } from './createFns';
import { Buttons } from './buttons';
import { Dialogic } from 'dialogic-react';

type TProps = {
  id?: string;
  spawn?: string;
  buttonName?: string;
  fns: ReturnType<typeof createFns>;
  children: ReactNode;
  instance: Dialogic.DialogicInstance;
};

export const PauseResumeRemaining = ({
  instance,
  id,
  spawn,
  fns,
  children,
  buttonName,
}: TProps) => {
  const identity = {
    id,
    spawn,
  };

  return (
    <div className="section" data-test-id={`pause-${id || 'default'}`}>
      <div className="control" data-test-id="reset-all">
        <div className="buttons">
          <button
            className="button"
            data-test-id="button-pause"
            onClick={() => instance.pause(identity)}
          >
            Pause
          </button>
          <button
            className="button"
            data-test-id="button-resume"
            onClick={() => instance.resume(identity)}
          >
            Resume
          </button>
          <button
            className="button"
            data-test-id="button-reset"
            onClick={() => instance.resetAll(identity)}
          >
            Reset
          </button>
        </div>
      </div>
      <div className="control" data-test-id="is-paused">
        {`Is paused: ${instance.isPaused(identity)}`}
      </div>
      <div className="control">{children}</div>
      <div className="content">
        <Buttons {...fns} id={id} name={buttonName} />
      </div>
    </div>
  );
};
