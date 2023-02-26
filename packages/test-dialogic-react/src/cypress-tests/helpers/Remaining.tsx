import { Dialogic } from 'dialogic';
import { useRemaining } from 'dialogic-react';
import React from 'react';

type Props = {
  instance: Dialogic.DialogicInstance;
  spawn?: string;
  id?: string;
};

export function Remaining({ instance, spawn, id }: Props) {
  const [displayValue] = useRemaining({
    instance,
    spawn,
    id,
  });

  return (
    <div data-test-id='remaining'>
      <span>Remaining: </span>
      <span data-test-id='remaining-value'>
        {displayValue === undefined ? 'undefined' : displayValue.toString()}
      </span>
    </div>
  );
}
