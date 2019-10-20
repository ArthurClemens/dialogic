/**
 * This example uses Material IO
 */

import m, { Component } from "mithril";
import { dialog } from "dialogic-mithril";

type DialogContentProps = {
  title: string;
  body: string;
  onAccept: () => void;
  onReject: () => void;
}

export const DialogComponent: Component<DialogContentProps> = {
  view: ({ attrs }) =>
    m(".mdc-dialog.mdc-dialog--open",
      [
        m(DialogContent, { ...attrs }),
        m(".mdc-dialog__scrim") // modal, onclick is not used
      ]
    )
};

const DialogContent: Component<DialogContentProps> = {
  view: ({ attrs }) => (
    m(".mdc-dialog__container",
      m(".mdc-dialog__surface",
        [
          m("h2.mdc-dialog__title",
            attrs.title
          ),
          m(".mdc-dialog__content",
            attrs.body
          ),
          m("footer.mdc-dialog__actions",
            [
              m("button.mdc-button.mdc-dialog__button", 
                {
                  onclick: () => {
                    dialog.hide();
                    attrs.onReject();
                  }
                },
                m("span.mdc-button__label", "Never mind")
              ),
              m("button.mdc-button.mdc-dialog__button", 
                {
                  onclick: () => {
                    dialog.hide();
                    attrs.onAccept();
                  }
                },
                m("span.mdc-button__label", "Yes, retry")
              )
            ]
          )
        ]
      )
    )
  )
};

