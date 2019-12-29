import React from "react";
import { notification } from "dialogic-react";
import { useRemaining } from "./useRemaining";

export const RemainingLabel = () => {
  const [remainingSeconds] = useRemaining({ instance: notification, roundToSeconds: false });

  return (
    <span style={{
      minWidth: "3em",
      textAlign: "left"
    }}>
      {remainingSeconds === undefined
        ? "0"
        : remainingSeconds.toString()}
    </span>
  );

};
