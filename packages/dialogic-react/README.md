# Dialogic for React


- [API](#api)
- [Demo](#demo)
- [Usage](#usage)
  - [Dialog](#dialog)
  - [Notification](#notification)
- [Size](#size)

## API

See: [Main documentation](https://github.com/ArthurClemens/dialogic/blob/development/README.md)


## Demo

* [Demo page](https://arthurclemens.github.io/dialogic/)
* [Live example using React Router](https://codesandbox.io/s/dialogic-for-react-route-example-kgq22)
* [Live example with dialog routes using React Router](https://codesandbox.io/s/dialogic-for-react-route-example-kgq22)

## Usage

### Dialog

```jsx
// index.jsx
import React from "react";
import { dialog, Dialog } from "dialogic-react";

const App = () => (
  <>
    <button onClick={() => {
      dialog.show({
        dialogic: {
          component: DialogView, // any component; see example below
          className: "dialog",
        },
        title: "Dialog Title"
      })
    }}>
      Show dialog
    </button>
    <Dialog /> {/* dialog will be drawn by this component */}
  </>
);

const DialogView = props => (
  <div className="dialog">
    <div className="dialog-background" onClick={() => dialog.hide()}></div>
    <div className="dialog-content">
      <h3>{props.title}</h3>
      <div>Dialog content</div>
    </div>
  </div>
);
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

```jsx
// index.jsx
import React from "react";
import { notification, Notification, useDialogicState } from "dialogic-react";

const App = () => (
  <>
    <button onClick={() => {
      notification.show({
        dialogic: {
          component: NotificationView, // any component; see example below
          className: "notification",
        },
        title: "Notification Title"
      })
    }}>
      Show notification
    </button>
    <Notification /> {/* notification will be drawn by this component */}
  </>
);

const NotificationView = props => {
  useDialogicState(); // required to retrieve the current state
  return (
    <div className="notification">
      <div className="notification-content">
        <h3>{props.title}</h3>
        <>
          <span>Message</span>
          
          {/* Optionally using pause/resume/isPaused: */}
          <button onClick={() => {
            notification.isPaused()
              ? notification.resume({ minimumDuration: 2000 })
              : notification.pause()
          }}>
            {notification.isPaused()
              ? <span>Continue</span>
              : <span>Wait</span>
            }
          </button>
        </>
      </div>
    </div>
  );
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


## Size

7.24 KB with all dependencies, minified and gzipped
