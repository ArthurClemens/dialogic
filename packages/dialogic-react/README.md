# Dialogic for React and NextJS


- [API](#api)
- [Demos](#demos)
- [Installation](#installation)
- [Usage](#usage)
  - [Dialog](#dialog)
  - [Notification](#notification)
  - [`useDialog`](#usedialog)
    - [Calling show and hide directly](#calling-show-and-hide-directly)
    - [With React Router](#with-react-router)
  - [`UseDialog` component](#usedialog-component)
    - [Example](#example)
  - [`useDialogicState`](#usedialogicstate)
  - [`useRemaining`](#useremaining)
- [Size](#size)



## API

See: [Main documentation](https://github.com/ArthurClemens/dialogic/blob/development/README.md)


## Demos

* [Online demo](https://arthurclemens.github.io/dialogic/)

Codesandbox examples:

* [All examples](https://codesandbox.io/dashboard/all/Dialogic/Dialogic%20for%20React?workspace=214fe89f-3718-4af2-9611-3b2cb150dcc5)
* Listed examples:
  * [Route example with useDialog hook](https://codesandbox.io/s/dialogic-for-react-route-example-with-usedialog-cutrx)
  * [Route example with UseDialog component](https://codesandbox.io/s/dialogic-for-react-route-example-with-usedialog-component-kgq22)
  * [NextJS example with useDialog hook](https://codesandbox.io/s/dialogic-for-react-nextjs-example-l713v)

Demo code in this repo:
* `./packages/demo-dialogic-react`
* `./packages/demo-dialogic-react-router`

## Installation

`npm install dialogic-react`


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


### `useDialog`

See also: `useNotification` and `useDialogic`.

In the following example the dialog is shown when the URL location matches the given path:

```ts
import { useDialog } from 'dialogic-react';
import { MyDialog } from './MyDialog';

const MyComponent = () => {
  const returnPath = '/';
  const dialogPath = '/some-path';
  const isRouteMatch = window.location.pathname === dialogPath;

  useDialog({
    isShow: isRouteMatch,
    props: {
      dialogic: {
        component: MyDialog,
        className: 'dialog',
      },
      // Props that will be passed to the MyDialog component
      returnPath,
    }
  });
};
```

**With TypeScript**

`useDialog` has a generic type to match the values passed to the component.

```ts
import { MyDialog, TDialogProps } from './MyDialog';

const returnPath = '/';
const dialogPath = '/some-path';
const content = 'Some async loaded content';
const isRouteMatch = window.location.pathname === dialogPath;

useDialog<TDialogProps>({
  isShow: isRouteMatch && !!content,
  deps: [content],
  props: {
    dialogic: {
      component: MyDialog,
      className: 'dialog',
    },
    // Props that will be passed to the MyDialog component
    // These props match type TDialogProps
    returnPath,
    content,
  }
})
```


#### Calling show and hide directly

In the example below:

* `show` is used to show the dialog
* Component MyDialog receives props `hideDialog` to explicitly hide the dialog
* `deps` includes the URL location - whenever it changes the dialog is hidden

```ts
import { useDialog } from 'dialogic-react';
import { MyDialog } from './MyDialog';

const MyComponent = () => {
  const { show, hide } = useDialog({
    deps: [window.location.href], // as soon this value changes ...
    hide: true,                   // ... hide
    props: {
      dialogic: {
        component: MyDialog,
        className: 'dialog',
      },
      // Props that will be passed to the MyDialog component
      returnPath,
      hideDialog: () => hide(),
    }
  });

  return (
    <button onClick={() => show()}>Show dialog</button>
  )
};
```

#### With React Router

Use `react-router` matching for more flexibility on matching routes. This can also be used to match on parametrized routes.

See also CodeSandbox demo: [Route example with useDialog](https://codesandbox.io/s/dialogic-for-react-route-example-with-usedialog-component-kgq22).


```js
import { useRouteMatch } from 'react-router-dom';

const dialogPath = '/profile/:name';
const matchDialogPath = useRouteMatch(dialogPath);

useDialog({
  isShow: !!matchDialogPath,
  ...
});
```

To only show the dialog on exact matches:

```js
useDialog({
  isShow: matchDialogPath ? matchDialogPath.isExact : false,
  ...
});
```


### `UseDialog` component

Helper component that wraps `useDialog` to use in JSX syntax, for example together with React Router.

It accepts the same props as `useDialog`.



#### Example

See also CodeSandbox demo: [Route example with UseDialog](https://codesandbox.io/s/dialogic-for-react-route-example-with-usedialog-component-kgq22)

```jsx
import { Route, useHistory } from 'react-router-dom';
import { UseDialog } from 'dialogic-react';
import { MyDialog } from './MyDialog';

export const MyDialogRoute = () => {
  const history = useHistory();
  const dialogPath = '/some-path';
  const returnPath = '/';
  const content = 'Some async loaded content';
  const isRouteMatch = history.location.pathname === dialogPath;

  return (
    <Route path={dialogPath}>
      <UseDialog
        show={isRouteMatch && !!content}
        deps={[content]}
        props={{
          dialogic: {
            component: MyDialog,
            className: 'dialog',
          },
          // Props that will be passed to the MyDialog component
          returnPath,
          content,
        }}
      />
    </Route>
  )
};
```

**With TypeScript**

```tsx
import { Route, useHistory } from 'react-router-dom';
import { UseDialog } from 'dialogic-react';
import { MyDialog, TDialogProps } from './MyDialog';

export const MyDialogRoute = () => {
  const history = useHistory();
  const dialogPath = '/some-path';
  const returnPath = '/';
  const content = 'Some async loaded content';
  const isRouteMatch = history.location.pathname === dialogPath;

  return (
    <Route path={dialogPath}>
      <UseDialog<TDialogProps>
        show={isRouteMatch && !!content}
        deps={[content]}
        props={{
          dialogic: {
            component: MyDialog,
            className: 'dialog',
          },
          // Props that will be passed to the MyDialog component
          // These props match type TDialogProps
          returnPath,
          content,
        }}
      />
    </Route>
  )
};
```

### `useDialogicState` 

To retrieve the current state in a component, add hook `useDialogicState`:

```tsx
import { dialog, useDialogicState } from "dialogic-react";

const MyComponent = props => {
  useDialogicState();

  return (
    <div>{dialog.getCount()}</div>
  )
}
```

### `useRemaining`

Hook to fetch the current remaining time.

```tsx
import { notification, useDialogicState, useRemaining } from "dialogic-react";

const MyComponent = props => {
  useDialogicState();
  const [remainingSeconds] = useRemaining({ instance: notification, roundToSeconds: true });
  // ...
}
```

## Size

- Module: `6.11 KB` with all dependencies, minified and gzipped
- UMD: `5.73 KB` with all dependencies, minified and gzipped