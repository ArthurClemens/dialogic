import { Dialogic } from "dialogic";
import m, { Component } from "mithril";

type ComponentProps<T = unknown> = T & {
  show: () => void;
  hide: () => void;
};

export const Instance = <T = unknown>({
  attrs: componentAttrs,
}: {
  attrs: Dialogic.DialogicalInstanceOptions<T>;
}) => {
  let domElement: HTMLElement;

  const dispatchTransition = (
    dispatchFn: Dialogic.DialogicalInstanceDispatchFn
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
    view: ({ attrs }: { attrs: Dialogic.DialogicalInstanceOptions<T> }) => {
      const component = attrs.dialogicOptions.component as Component<
        ComponentProps<T>
      >;
      if (!component) {
        throw new Error("Component missing in dialogic options.");
      }
      const passThroughOptions: T = attrs.passThroughOptions || ({} as T);
      return m(
        "div",
        { className: attrs.dialogicOptions.className },
        m(component, {
          ...passThroughOptions,
          show,
          hide,
        })
      );
    },
  };
};
