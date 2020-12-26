import React, { FunctionComponent, useEffect } from 'react';
import { Dialogic } from 'dialogic';
import { Wrapper } from './Wrapper';
import { useDialogicState } from './useDialogicState';

type DialogicalFn = (
  type: Dialogic.DialogicInstance,
) => FunctionComponent<Dialogic.ComponentOptions>;

export const Dialogical: DialogicalFn = instance => props => {
  useDialogicState();

  const identityOptions = {
    id: props.id || instance.defaultId,
    spawn: props.spawn || instance.defaultSpawn,
  };

  // Mount
  useEffect(() => {
    if (typeof props.onMount === 'function') {
      props.onMount();
    }
  }, []);

  return <Wrapper identityOptions={identityOptions} ns={instance.ns} />;
};
