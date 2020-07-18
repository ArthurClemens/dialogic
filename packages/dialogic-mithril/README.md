# Dialogic for Mithril

Manage dialogs and notifications.

- [API](#api)
- [Demo](#demo)
- [Install](#install)
- [Usage](#usage)
  - [Dialog](#dialog)
  - [Notification](#notification)
- [Size](#size)

## API

See: [Main documentation](https://github.com/ArthurClemens/dialogic/blob/development/README.md)

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
  transition: opacity 350ms ease-in-out;
  opacity: 0;
}
.dialog-show-start {}
.dialog-show-end {
  opacity: 1;
}
.dialog-hide-start {}
.dialog-hide-end {
  opacity: 0;
}
```

### Notification

[Live example](https://flems.io/#0=N4Igxg9gdgzhA2BTEAucD4EMAONEBMQAaEAMwEskZUBtUKTAW2TQDoALAF0fmPSk6IBqEAB585AG4ACcvgC8AHRA5sygHyiA9BMnq+eJGE7lo1NAAYUAJgsgAvkXpMWIVgCtqJSAKGcRWlqyjNgQAE6c0sDSUBAmFGCYJtBE0gByceQJSaZQ0vbSpGEQjNLKEpjwEADm5GAAtIzknOxhlMoA3IpQPjCR0bHxdTkp6ZnZyXkF8tIVVbVgALLNrZRdUN29kQCC2NjSM8Dd0tKS5IgA7ijSABQAlAfq0jTHJ9KMN8qsqsqpL3lvE4fZQAIwArpxONBflFXoCTtAwPA6gBra73R6wgHwt6DLLDSasGDsCAXG5HbE4t5zGp1a4UqlUyAhaB+a4ZIaJSYANXOF1SgWkmCgAE9pMzQlA-B1pHhENJEAAPJjYJDSEGIKoXOGMt5IzAwGBpFzXZR4ia5X46xmOa1UkycJCmkAc-Fc3LSAAqzSQyjtgPsd39+TtjjKIAAyiSLjFxgTLSA7kQdQBdJM6j6ui3QB6C83x6DSC6UeDq+X4MKYC55EFilrkGDikqSvyvFPdezrTZmSJZgtQXmXA5Yk5nS7o6JJThhRuBx4Zz5ufPu6D1HyCAQw-444EgdgAZhhU5nrAdSHTlKBi90W+Du5vxHDi0Qhsw1UQygvjMFAHlsJNKngMUwRgcgoGqaRsEwEDEC0MIXzBZgtAbAAFaC8HwFA72vKQYWDK9QQhKENmIfC3gZXVAURZEwDRW4HnkJ4yJxZcRigVhUPQgh7mYqkAH5Y05NjWHgmBEMQcl3jA8hGEQgARMFK0ma5bAsCx8iDS9KLea5WMJKCYJ4rScVtYz4T03IOJgNCYPwIztLeATlAAYWgEwoDBD8QF4k5nQAdUwZo-TMk5NMZML4TTVNNM7bpukYVhGAgMEBE+AF8AgMBxIEVgAEdPLCEUI01RBjHCRcAGIfkTZMAV2NQoDuLsoAMErjFycwQGsAAWGwAA4HCcEAGGYERWDAQ0+HXPwRBBCB8DFCjSDc+pSCYSgRWuGBhRgeo8DaUh1nsbpWAswsKOnHbmlya4ICgsBmjFfc1MYGAjpOs6oD26M9s4TAIhHaQ7swB7OE26QLHe9jPu+0l6iEfBAeB0HwYARih064xXL72DkRBfv+-pXmRx7rnRjsPqxtj6lx-B8YRpH7tJiGoZOumksBqD8AkcCVIsbBFQxmHpoEQG5rCOmwjJgXZQQORpAq7n8HWE4uZ56o+YFlX3n+2ooE1xUWY7VqjEmTrrAAVhQVGADYHBTEhkSgFFzDoYaXBEJoWjaXgSEU3g0C4ThcBQQIUuwFFqnGkotC91Z4AAAWsVgLFYbrY5WH3ErAjwvBAMHsFcGAwDaf9BucUa0BpBZGkzygE6wQQ+j4f2RCDkOw6gCOo+ZHRyEqWkGjjn2E9T5PUb7vo+4Hmvh8oXO+ALouS-IMv7BTewgA)

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
      ])
    ])
};
```

```css
/* index.css */
.notification {
  transition: opacity 350ms;
  opacity: 0;
}
.notification-show-start {}
.notification-show-end {
  opacity: 1;
}
.notification-hide-start {}
.notification-hide-end {
  opacity: 0;
}
```

## Size

 3.55 KB with all dependencies, minified and gzipped
