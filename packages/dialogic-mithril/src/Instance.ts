
import m, { Component } from "mithril";
import { Dialogic } from "dialogic";

interface Instance extends Dialogic.DialogicalInstanceOptions{}

type InstanceFn = ({ attrs } : { attrs: Dialogic.DialogicalInstanceOptions }) => Component<Dialogic.DialogicalInstanceOptions>;

export const Instance: InstanceFn = ({ attrs }) => {
  let domElement: HTMLElement;

  const className = attrs.dialogicOptions.className;
  
  const dispatchTransition = (dispatchFn: Dialogic.DialogicalInstanceDispatchFn) => {
    dispatchFn({
      detail: {
        identityOptions: attrs.identityOptions,
        domElement
      }
    });
  };

  const onMount = () => {
    dispatchTransition(attrs.onMount);
  };

  const show = () => {
    dispatchTransition(attrs.onShow);
  };

  const hide = () => {
    dispatchTransition(attrs.onHide);
  };

  return {
    oncreate: (vnode: { dom: Element }) => {
      domElement = vnode.dom as HTMLElement;
      onMount();
    },
    view: () => {
      return m("div",
        {
          className,
          "data-spawn-id": attrs.identityOptions.spawn,
          "data-id": attrs.identityOptions.id,
        },
        m(attrs.dialogicOptions.component,
          {
            ...attrs.passThroughOptions,
            show,
            hide,
          }
        )
      )
    }
  };
};
