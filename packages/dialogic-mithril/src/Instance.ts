import m, { Component, ClosureComponent } from 'mithril';
import { Dialogic } from 'dialogic';

export const Instance: ClosureComponent<Dialogic.DialogicalInstanceOptions<
  Dialogic.PassThroughOptions
>> = ({ attrs: componentAttrs }) => {
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
      const component = attrs.dialogicOptions.component as Component<
        Dialogic.PassThroughOptions
      >;
      if (!component) {
        throw 'Component missing in dialogic options.';
      }
      return m(
        'div',
        { className: attrs.dialogicOptions.className },
        m(component, {
          ...attrs.passThroughOptions,
          show,
          hide,
        }),
      );
    },
  };
};
