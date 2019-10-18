[Main page](../../README.md)

# Dialogic for Mithril

Manage dialogs and notifications.

- [Usage](#usage)
  - [`show` function](#show-function)
    - [Options passed to the `dialogic` object](#options-passed-to-the-dialogic-object)
      - [`component`](#component)

## Usage

See also the [main documentation](../../README.md#api) for the Dialogic API.

```javascript
import m from "mithril";
import { dialog, Dialog } from "dialogic-mithril";

const App = {
  view: () => [
    m(".button", {
      onclick: () => {
        dialog.show({
          dialogic: {
            component: DialogView, // any component; see example below
            className: "dialog",
          },
          title: "Dialog Title"
        })
      }
    }, "Show dialog"),
    m(Dialog) // dialog will be drawn by this component
  ]
};

const DialogView = {
  view: ({ attrs }) =>
    m(".dialog", [
      m(".dialog-background", {
        onclick: () => dialog.hide()
      }),
      m(".dialog-content", [
        m("h3", attrs.title),
        m("div", "Dialog content")
      ])
    ])
};
```

### `show` function

See also [show function](../../README.md#show-function) in the main documentation.

#### Options passed to the `dialogic` object

##### `component`

Pass the component that will be rendered as dialog.

In this example the title is passed using the component props:

```javascript
dialog.show({
  dialogic: {
    component: DialogView,
  },
  title: "Dialog Title"
})
```

```javascript
import m from "mithril";

export const DialogView = {
  view: ({ attrs }) =>
    m(".dialog", [
      m(".dialog-content", [
        m("h3", attrs.title),
        m("div", "Dialog content")
      ])
    ])
};
```
