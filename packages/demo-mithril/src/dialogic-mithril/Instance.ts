
import m from "mithril";
import { Dialogic } from "dialogic";

type DispatchFn = (event: Dialogic.InstanceEvent) => void;

export type InstanceOptions = {
  spawnOptions: Dialogic.SpawnOptions;
  transitionOptions: Dialogic.TransitionOptions;
  instanceOptions: Dialogic.InstanceOptions;
  onMount: DispatchFn;
  onShow: DispatchFn;
  onHide: DispatchFn;
}

export const Instance = ({ attrs } : { attrs: InstanceOptions }) => {
  let domElement: HTMLElement;

  const classNames = [
    attrs.transitionOptions.className,
    attrs.instanceOptions.className
  ].join(" ");
  
  const dispatchTransition = (dispatchFn: DispatchFn) => {
    dispatchFn({
      detail: {
        spawnOptions: attrs.spawnOptions,
        transitionOptions: {
          className: attrs.transitionOptions.className,
          showClassName: attrs.transitionOptions.showClassName,
          domElements: {
            domElement
          },
        },
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
      console.log("oncreate", vnode.dom);
      domElement = vnode.dom as HTMLElement;
      onMount();
    },
    view: () => {
      return m("div",
        {
          className: classNames,
        },
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
