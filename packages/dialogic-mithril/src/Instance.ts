import { Dialogic } from 'dialogic';
import m, { ClosureComponent, Component } from 'mithril';

type ComponentProps = Dialogic.PassThroughOptions & {
  show: () => void;
  hide: () => void;
};

export const Instance: ClosureComponent<
  Dialogic.DialogicalInstanceOptions<Dialogic.PassThroughOptions>
> = ({ attrs: componentAttrs }) => {
  let domElement: HTMLElement;

  const dispatchTransition = (
    dispatchFn: Dialogic.DialogicalInstanceDispatchFn,
  ) => {
    dispatchFn({
      detail: {
        identityOptions: componentAttrs.identityOptions,
        domElement,
      },
    });
  };

  const onMount = () => {
    dispatchTransition(componentAttrs.onMount);
  };

  const show = () => {
    dispatchTransition(componentAttrs.onShow);
  };

  const hide = () => {
    dispatchTransition(componentAttrs.onHide);
  };

  return {
    oncreate: (vnode: { dom: Element }) => {
      domElement = vnode.dom as HTMLElement;
      onMount();
    },
    view: ({ attrs }) => {
      const component = attrs.dialogicOptions
        .component as Component<ComponentProps>;
      if (!component) {
        throw new Error('Component missing in dialogic options.');
      }
      const passThroughOptions = (attrs.passThroughOptions as {}) || {};
      return m(
        'div',
        { className: attrs.dialogicOptions.className },
        m(component, {
          ...passThroughOptions,
          show,
          hide,
        }),
      );
    },
  };
};
