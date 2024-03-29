import React, { useState } from 'react';

import { useAnimationFrame } from '../useAnimationFrame';

type RemainingProps = {
  getRemainingFn: () => number | undefined;
};

export function RemainingWithAnimationFrame(props: RemainingProps) {
  const [displayValue, setDisplayValue] = useState<number>();

  useAnimationFrame(() => {
    const remaining = props.getRemainingFn();
    if (remaining !== undefined && displayValue !== remaining) {
      setDisplayValue(Math.max(remaining, 0));
    } else {
      setDisplayValue(undefined);
    }
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
