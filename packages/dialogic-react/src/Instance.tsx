import { Dialogic } from 'dialogic';
// eslint-disable-next-line import/no-unresolved
import { FunctionComponent, useCallback, useRef } from 'react';

type ComponentProps = Dialogic.PassThroughOptions & {
  show: () => void;
  hide: () => void;
};

export const Instance = (
  props: Dialogic.DialogicalInstanceOptions<Dialogic.PassThroughOptions>,
) => {
  const domElementRef = useRef();
  const { className } = props.dialogicOptions;
  const Component = props.dialogicOptions
    .component as FunctionComponent<ComponentProps>;
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

  const domElementCb = useCallback(node => {
    if (node !== null) {
      domElementRef.current = node;
      onMount();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const passThroughOptions = props.passThroughOptions || {};
  console.log(
    'passThroughOptions',
    JSON.stringify(passThroughOptions, null, 2),
  );

  return (
    <div ref={domElementCb} className={className}>
      <Component {...passThroughOptions} show={show} hide={hide} />
    </div>
  );
};
