import { Dialogic } from 'dialogic';
// eslint-disable-next-line import/no-unresolved
import { useEffect } from 'react';

import { useDialogicState } from './useDialogicState';
import { Wrapper } from './Wrapper';

type Props = {
  instance: Dialogic.DialogicInstance;
} & Dialogic.ComponentOptions;

export const Dialogical = ({ instance, ...props }: Props) => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Wrapper identityOptions={identityOptions} ns={instance.ns} />;
};
