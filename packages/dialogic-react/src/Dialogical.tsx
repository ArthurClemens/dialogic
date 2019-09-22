import React, { FunctionComponent, useEffect } from "react";
import { Dialogic } from "dialogic";
import { Wrapper } from "./Wrapper";
import { useDialogicState } from "./useDialogicState";

type DialogicalFn = (type: Dialogic.DialogicInstance) => FunctionComponent<Dialogic.ComponentOptions>;

export const Dialogical: DialogicalFn = type => props => {
  useDialogicState();

  const identityOptions = {
    id: props.id || type.defaultId,
    spawn: props.spawn || type.defaultSpawn,
  };

  // Mount
  useEffect(() => {
    if (typeof props.onMount === "function") {
      props.onMount();
    }
  }, []);

  return <Wrapper identityOptions={identityOptions} ns={type.ns} />;
};
