
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
        identityOptions: attrs.identityOptions, // for identification
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
        { className },
        m(attrs.dialogicOptions.component,
          {
            ...attrs.passThroughOptions,
            show,
            hide,
          },
          [
            m("div", "Instance"),
            m("button", { onclick: () => hide()}, "Hide from instance"),
          ]
        )
      )
    }
  };
};
