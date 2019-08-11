
import m, { Component } from "mithril";
import { Dialogic } from "dialogic";

interface Instance extends Dialogic.DialogicalInstanceOptions{}

type InstanceFn = ({ attrs } : { attrs: Dialogic.DialogicalInstanceOptions }) => Component<Dialogic.DialogicalInstanceOptions>;

export const Instance: InstanceFn = ({ attrs }) => {
  let domElement: HTMLElement;

  const className = attrs.transitionOptions.transitionClassName;
  
  const dispatchTransition = (dispatchFn: Dialogic.DialogicalInstanceDispatchFn) => {
    dispatchFn({
      detail: {
        spawnOptions: attrs.spawnOptions, // for identification
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
        m(attrs.transitionOptions.component,
          {
            ...attrs.instanceOptions,
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
