import { Dialogic, filterCandidates, selectors } from 'dialogic';
import React from 'react';

import { Instance } from './Instance';
import {
  onHideInstance,
  onInstanceMounted,
  onShowInstance,
} from './instanceEvents';

export function Wrapper(props: Dialogic.DialogicalWrapperOptions) {
  const nsOnInstanceMounted = onInstanceMounted(props.ns);
  const nsOnShowInstance = onShowInstance(props.ns);
  const nsOnHideInstance = onHideInstance(props.ns);

  const identityOptions: Dialogic.IdentityOptions =
    props.identityOptions || ({} as Dialogic.IdentityOptions);
  const filtered = filterCandidates(
    props.ns,
    selectors.getStore(),
    identityOptions,
  );

  return (
    <>
      {filtered.map(item => (
        <Instance
          key={item.key}
          identityOptions={item.identityOptions}
          dialogicOptions={
            item.dialogicOptions as Dialogic.DialogicOptions<Dialogic.PassThroughOptions>
          }
          passThroughOptions={
            item.passThroughOptions as Dialogic.PassThroughOptions
          }
          onMount={nsOnInstanceMounted}
          onShow={nsOnShowInstance}
          onHide={nsOnHideInstance}
        />
      ))}
    </>
  );
}
