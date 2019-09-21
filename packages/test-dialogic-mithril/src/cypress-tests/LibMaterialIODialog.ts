import m from "mithril";
import { dialog, Dialog } from "dialogic-mithril";

const DemoContent = {
  view: () => (
    m("div", {"class":"mdc-dialog__container"}, 
      m("div", {"class":"mdc-dialog__surface"},
        [
          m("h2", {"class":"mdc-dialog__title","id":"my-dialog-title"}, 
            "Dialog Title"
          ),
          m("div", {"class":"mdc-dialog__content","id":"my-dialog-content"}, 
            " Dialog body text goes here. "
          ),
          m("footer", {"class":"mdc-dialog__actions"},
            [
              m("button", {"class":"mdc-button mdc-dialog__button","type":"button","data-mdc-dialog-action":"no"}, 
                m("span", {
                  "class":"mdc-button__label",
                  onclick: () => dialog.hide()
                }, 
                  "No"
                )
              ),
              m("button", {"class":"mdc-button mdc-dialog__button","type":"button","data-mdc-dialog-action":"yes"}, 
                m("span", {
                  "class":"mdc-button__label",
                  onclick: () => dialog.hide()
                }, 
                  "Yes"
                )
              )
            ]
          )
        ]
      )
    )
  )
};

const MaterialIODialogComponent = (isModal: boolean = false) => ({
  view: () =>
    m(".mdc-dialog--open", {"class":"mdc-dialog","role":"alertdialog","aria-modal":"true","aria-labelledby":"my-dialog-title","aria-describedby":"my-dialog-content"},
      [
        m(DemoContent),
        m("div", {
          "class":"mdc-dialog__scrim",
          onclick: () => !isModal && dialog.hide()
        })
      ]
    )
});


export default () => {
  
  return {
    view: () => {
      return m(".test", [
        m(".buttons", [
          m(".button", {
            onclick: () => {
              dialog.show({
                dialogic: {
                  component: MaterialIODialogComponent(),
                  className: "dialog",
                }
              })
            }
          }, "Show dialog"),
          m(".button", {
            onclick: () => {
              dialog.show({
                dialogic: {
                  component: MaterialIODialogComponent(true),
                  className: "dialog",
                }
              })
            }
          }, "Show modal dialog"),
        ]),
        m(".materialIO", 
          m(Dialog)
        ),
      ])
    }
  }; 
};
