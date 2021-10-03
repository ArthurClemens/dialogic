import m, { Component } from "mithril";

export type TDefault = {
  contentId: string;
  title: string;
  className: string;
  hide: () => void;
};

export const Default: Component<TDefault> = {
  view: ({ attrs }) =>
    m(
      "div",
      {
        className: attrs.className,
        "data-test-id": `content-default${
          attrs.contentId ? `-${attrs.contentId}` : ""
        }`,
      },
      [
        m("h2", attrs.title),
        m(
          "button",
          {
            className: "button",
            onclick: () => attrs.hide(),
            "data-test-id": "button-hide-content",
          },
          "Hide from component"
        ),
      ]
    ),
};
