
import React, { FunctionComponent, useCallback, useRef } from "react";
import { Dialogic } from "dialogic";

interface Instance extends Dialogic.DialogicalInstanceOptions{}

export const Instance: FunctionComponent<Dialogic.DialogicalInstanceOptions> = props => {
  const domElementRef = useRef();
  const className = props.dialogicOptions.className;
  const Component = props.dialogicOptions.component;

  const domElementCb = useCallback(node => {
    if (node !== null) {
      domElementRef.current = node;
      onMount();
    }
  }, []);

  const dispatchTransition = (dispatchFn: Dialogic.DialogicalInstanceDispatchFn) => {    
    const domElement = domElementRef.current;
    if (domElement === undefined) {
      return;
    }
    dispatchFn({
      detail: {
        identityOptions: props.identityOptions,
        domElement
      }
    });
  };

  const onMount = () => {
    dispatchTransition(props.onMount);
  };

  const show = () => {
    dispatchTransition(props.onShow);
  };

  const hide = () => {
    dispatchTransition(props.onHide);
  };

  return (
    <div
      ref={domElementCb}
      className={className}
    >
      <Component
        {...props.passThroughOptions}
        show={show}
        hide={hide}
      />
    </div>
  );
};
