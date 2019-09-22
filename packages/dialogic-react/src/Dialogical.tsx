import React, { FunctionComponent, useEffect, useState } from "react";
import { Dialogic } from "dialogic";
import { Wrapper } from "./Wrapper";
import { useAnimationFrame } from "./useAnimationFrame";

type DialogicalFn = (type: Dialogic.DialogicInstance) => FunctionComponent<Dialogic.ComponentOptions>;

export const Dialogical: DialogicalFn = type => props => {
  const [, setUpdateCount] = useState(0);

  const identityOptions = {
    id: props.id || type.defaultId,
    spawn: props.spawn || type.defaultSpawn,
  };

  // Mount
  useEffect(
    () => {
      if (typeof props.onMount === "function") {
        props.onMount();
      }
    },
    []
  );

  // Use animation frame to create redraws without hitting "Can't perform a React state update on an unmounted component."
  useAnimationFrame((deltaTime: number) => {
    setUpdateCount(prevCount => (prevCount + deltaTime * 0.01) % 100);
  })

  return <Wrapper identityOptions={identityOptions} ns={type.ns} />;
};
