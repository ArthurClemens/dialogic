import React from 'react';
import { useRemaining } from 'dialogic-react';
import { Dialogic } from 'dialogic';

type TProps = {
  instance: Dialogic.DialogicInstance;
  spawn?: string;
  id?: string;
};

export const Remaining = ({ instance, spawn, id }: TProps) => {
  const [displayValue] = useRemaining({
    instance,
    spawn,
    id,
  });

  return (
    <div data-test-id="remaining">
      <span>Remaining: </span>
      <span data-test-id="remaining-value">
        {displayValue === undefined ? 'undefined' : displayValue.toString()}
      </span>
    </div>
  );
};
