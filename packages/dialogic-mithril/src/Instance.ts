
import m, { Component } from "mithril";
import { Dialogic } from "dialogic";

interface Instance extends Dialogic.DialogicalInstanceOptions{}

type InstanceFn = ({ attrs } : { attrs: Dialogic.DialogicalInstanceOptions }) => Component<Dialogic.DialogicalInstanceOptions>;

export const Instance: InstanceFn = ({ attrs: componentAttrs }) => {
  let domElement: HTMLElement;

  const dispatchTransition = (dispatchFn: Dialogic.DialogicalInstanceDispatchFn) => {
    dispatchFn({
      detail: {
        identityOptions: componentAttrs.identityOptions,
        domElement
      }
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
    view: ({ attrs }) => (
      m("div",
        { className: attrs.dialogicOptions.className },
        m(attrs.dialogicOptions.component,
          {
            ...attrs.passThroughOptions,
            show,
            hide,
          }
        )
      )
    )
  };
};
