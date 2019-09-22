import React, { useState, FunctionComponent } from "react";
import { useAnimationFrame } from "./useAnimationFrame";

type RemainingProps = {
  getRemaining: () => number | undefined;
}

export const Remaining: FunctionComponent<RemainingProps> = props => {
  const [displayValue, setDisplayValue] = useState();

  useAnimationFrame(() => {
    const remaining = props.getRemaining();
    if (remaining !== undefined) {
      if (displayValue !== remaining) {
        setDisplayValue(Math.max(remaining, 0));
      }
    } else {
      setDisplayValue(undefined);
    }
  });

  return (
    <div data-test-id="remaining">
      <span>Remaining: </span>
      <span data-test-id="remaining-value">{displayValue === undefined
        ? "undefined"
        : displayValue.toString()}</span>
    </div>
  );

};
