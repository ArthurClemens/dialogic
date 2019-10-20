# Dialogic for Mithril

Manage dialogs and notifications.

[Main documentation](../../README.md)


## Demo

[Demo page](https://arthurclemens.github.io/dialogic/)


## Install

`npm install dialogic-mithril`


## Usage

### Dialog

```javascript
// index.js
import m from "mithril";
import { dialog, Dialog } from "dialogic-mithril";

const App = {
  view: () => [
    m("button", {
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

```css
/* index.css */
.dialog {
  transition: opacity 300ms ease-in-out;
}
.dialog-show-start {
  opacity: 0;
}
.dialog-show-end {
  opacity: 1;
}
.dialog-hide-start {
  opacity: 1;
}
.dialog-hide-end {
  opacity: 0;
}
```

### Notification

```javascript
// index.js
import m from "mithril";
import { notification, Notification } from "dialogic-mithril";

const App = {
  view: () => [
    m(".button", {
      onclick: () => {
        notification.show({
          dialogic: {
            component: NotificationView, // any component; see example below
            className: "notification",
          },
          title: "Notification Title"
        })
      }
    }, "Show notification"),
    m(Notification) // notification will be drawn by this component
  ]
};

const NotificationView = {
  view: ({ attrs }) =>
    m(".notification", [
      m("h3", attrs.title),
      m("div", [
        m("span", "Message"),
        // Optionally using pause/resume/isPaused:
        m("button",
          {
            onclick: () => 
              notification.isPaused()
                ? notification.resume({ minimumDuration: 2000 })
                : notification.pause()
          },
          notification.isPaused()
            ? "Continue"
            : "Wait"
        )
      ]
    ])
};
```

```css
/* index.css */
.notification {
  transition: opacity 300ms;
}
.notification-show-start {
  opacity: 0;
}
.notification-show-end {
  opacity: 1;
}
.notification-hide-start {
  opacity: 1;
}
.notification-hide-end {
  opacity: 0;
}
```
