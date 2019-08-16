import React, { FunctionComponent, useState, useEffect, useRef } from "react";

type RemainingProps = {
  getRemaining: () => number | undefined;
}

export const Remaining: FunctionComponent<RemainingProps> = props => {
  const [displayValue, setDisplayValue] = useState();
  const reqRef = useRef<number>(0);

  const update = () => {
    const remaining = props.getRemaining();
    if (remaining !== undefined) {
      if (displayValue !== remaining) {
        setDisplayValue(Math.max(remaining, 0));
      }
    } else {
      setDisplayValue(undefined);
    }
    // Loop:
    reqRef.current = window.requestAnimationFrame(update);
  };

  useEffect(
    () => {
      reqRef.current = window.requestAnimationFrame(update);

      return () => {
        window.cancelAnimationFrame(reqRef.current);
      }
    },
    []
  );

  return (
    <div>{`Remaining: ${displayValue}`}</div>
  );
};
