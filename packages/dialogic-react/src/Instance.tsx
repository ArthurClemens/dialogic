import { Dialogic } from 'dialogic';
import React, { FunctionComponent, useCallback, useRef } from 'react';

type ComponentProps<T = unknown> = T & {
  show: () => void;
  hide: () => void;
};

export function Instance<T>(props: Dialogic.DialogicalInstanceOptions<T>) {
  const domElementRef = useRef<HTMLDivElement>();
  const { className } = props.dialogicOptions;
  const Component = props.dialogicOptions.component as FunctionComponent<
    ComponentProps<T>
  >;
  if (!Component) {
    throw new Error('Component missing in dialogic options.');
  }

  const dispatchTransition = (
    dispatchFn: Dialogic.DialogicalInstanceDispatchFn,
  ) => {
    const domElement = domElementRef.current;
    if (domElement === undefined) {
      return;
    }
    dispatchFn({
      detail: {
        identityOptions: props.identityOptions,
        domElement,
      },
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

  const domElementCb = useCallback((node: HTMLDivElement) => {
    if (node !== null) {
      domElementRef.current = node;
      onMount();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const passThroughOptions: T = props.passThroughOptions || ({} as T);

  return (
    <div ref={domElementCb} className={className}>
      <Component {...passThroughOptions} show={show} hide={hide} />
    </div>
  );
}
