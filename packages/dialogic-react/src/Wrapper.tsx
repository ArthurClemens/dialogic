import React, { FunctionComponent } from "react";
import { filterCandidates, selectors, Dialogic } from "dialogic";
import { onInstanceMounted, onShowInstance, onHideInstance } from "./instanceEvents";
import { Instance } from "./Instance";

interface WrapperProps extends Dialogic.DialogicalWrapperOptions {}

export const Wrapper: FunctionComponent<WrapperProps> = props => {
  const nsOnInstanceMounted = onInstanceMounted(props.ns);
  const nsOnShowInstance = onShowInstance(props.ns);
  const nsOnHideInstance = onHideInstance(props.ns);
  
  const identityOptions: Dialogic.IdentityOptions = props.identityOptions || {} as Dialogic.IdentityOptions;
  const filtered = filterCandidates(props.ns, selectors.getStore(), identityOptions);

  return (
    <>
      {filtered.map(item =>
        <Instance
          key={item.key}
          identityOptions={item.identityOptions}
          dialogicOptions={item.dialogicOptions}
          passThroughOptions={item.passThroughOptions}
          onMount={nsOnInstanceMounted}
          onShow={nsOnShowInstance}
          onHide={nsOnHideInstance}
        />
      )}
    </>
  );
};
