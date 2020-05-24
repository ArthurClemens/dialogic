# Dialogic for React


- [API](#api)
- [Demo](#demo)
- [Usage](#usage)
  - [Dialog](#dialog)
  - [Notification](#notification)
  - [Dialog routes](#dialog-routes)
    - [useMakeAppearDialog](#usemakeappeardialog)
      - [Options](#options)
      - [All hooks](#all-hooks)
      - [Example](#example)
      - [With TypeScript](#with-typescript)
    - [MakeAppearDialog component](#makeappeardialog-component)
      - [All appear components](#all-appear-components)
      - [Example](#example-1)
      - [With TypeScript](#with-typescript-1)
- [Size](#size)

## API

See: [Main documentation](https://github.com/ArthurClemens/dialogic/blob/development/README.md)


## Demo

* [Demo page](https://arthurclemens.github.io/dialogic/)
* [Route example with useMakeAppearDialog](https://codesandbox.io/s/dialogic-for-react-route-example-with-usemakeappeardialog-cutrx)
* [Route example with MakeAppearDialog](https://codesandbox.io/s/dialogic-for-react-route-example-with-makeappeardialog-kgq22)

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

### Dialog routes

It's often desired to let a dialog have its own URL so that page refresh will still show the dialog, and using the browser back button will hide the dialog.

A common pattern is to create a Route that contains the dialog component:

```tsx
import { Route, useRouteMatch } from 'react-router-dom';

const match = useRouteMatch();
const dialogPath = `${match.url}/edit`;

<Route path={dialogPath}>
  // Dialog should appear here
</Route>
```


#### useMakeAppearDialog

This is a Hook to automatically show a dialog on URL location match. The dialog will hide when the URL location no longer matches.

##### Options

| **Name**           | **Type**             | **Required** | **Description**                                                                                                                                                                                            | **Default value**          |
| ------------------ | -------------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| `pathname`         | `string`             | Yes          | Show the dialog when pathname is equal to the window.location.pathname, hide when they are no longer equal. When `predicate` is used, both conditions must be true.                                        | None                       |
| `locationPathname` | string               | No           | The current location. Pass a custom value when using a hash router. For example with React Router, pass: `history.location.pathname` (see example "MakeAppearDialog component" below).                     | `window.location.pathname` |
| `predicate`        | () => boolean        | No           | Only show the instance when the predicate is met. Predicate function that returns true when the instance should appear. Can be omitted when all content is static, so no re-rendering takes place.         | None                       |
| `deps`             | React.DependencyList | No           | Update the hook with these deps. Use this when the instance should appear conditionally, for instance only when content exists. Can be omitted when all content is static, so no re-rendering takes place. | `[]`                       |
| `props`            | Object               | Yes          | Props to pass to the dialog.                                                                                                                                                                               | None                       |


##### All hooks

* `useMakeAppear` - generic hook that accepts `instance` of type `Dialogic.DialogicInstance`.
* `useMakeAppearDialog` - `useMakeAppear` with `instance` preset to `dialog`.
* `useMakeAppearNotification` - `useMakeAppear` with `instance` preset to `notification`.


##### Example

See also CodeSandbox demo: [Route example with useMakeAppearDialog](https://codesandbox.io/s/dialogic-for-react-route-example-with-usemakeappeardialog-cutrx)

```ts
import { useMakeAppearDialog } from 'dialogic-react';
import { LoginDialog } from './LoginDialog';

const returnPath = '/';
const dialogPath = '/login';
const content = 'Some async loaded content';

useMakeAppearDialog({
  pathname: dialogPath,
  predicate: () => !!content,
  deps: [content],
  props: {
    dialogic: {
      component: LoginDialog,
      className: 'dialog',
    },
    // Example props that will be passed to the LoginDialog component
    returnPath,
    content,
  }
})
```

##### With TypeScript

```ts
import { LoginDialog, TLoginDialogProps } from './LoginDialog';

useMakeAppearDialog<TLoginDialogProps>({
  pathname: dialogPath,
  predicate: () => !!content,
  deps: [content],
  props: {
    dialogic: {
      component: LoginDialog,
      className: 'dialog',
    },
    // Example props that will be passed to the LoginDialog component
    // These props match type TLoginDialogProps
    returnPath,
    content,
  }
})
```


#### MakeAppearDialog component

Helper component that wraps `useMakeAppearDialog` to use in JSX syntax, for example together with React Router.

It accepts the same props as `useMakeAppearDialog`.

##### All appear components

* `MakeAppear` - generic component that accepts `instance` of type `Dialogic.DialogicInstance`.
* `MakeAppearDialog` - `MakeAppear` with `instance` preset to `dialog`.
* `MakeAppearNotification` - `MakeAppear` with `instance` preset to `notification`.


##### Example

See also CodeSandbox demo: [Route example with MakeAppearDialog](https://codesandbox.io/s/dialogic-for-react-route-example-with-makeappeardialog-kgq22)

```jsx
import { Route, useHistory } from 'react-router-dom';
import { MakeAppearDialog } from 'dialogic-react';
import { LoginDialog } from './LoginDialog';

export const LoginDialogRoute = () => {
  const history = useHistory();
  const dialogPath = '/login';
  const returnPath = '/';
  const content = 'Some async loaded content';

  return (
    <Route path={dialogPath}>
      <MakeAppearDialog
        pathname={dialogPath}
        locationPathname={history.location.pathname}
        predicate={() => !!content}
        deps={[content]}
        props={{
          dialogic: {
            component: LoginDialog,
            className: 'dialog',
          },
          // Example props that will be passed to the LoginDialog component
          returnPath,
          content,
        }}
      />
    </Route>
  )
};
```

##### With TypeScript

```tsx
import { Route, useHistory } from 'react-router-dom';
import { MakeAppearDialog } from 'dialogic-react';
import { LoginDialog, TLoginDialogProps } from './LoginDialog';

export const LoginDialogRoute = () => {
  const history = useHistory();
  const dialogPath = '/login';
  const returnPath = '/';
  const content = 'Some async loaded content';

  return (
    <Route path={dialogPath}>
      <MakeAppearDialog<TLoginDialogProps>
        pathname={dialogPath}
        locationPathname={history.location.pathname}
        predicate={() => !!content}
        deps={[content]}
        props={{
          dialogic: {
            component: LoginDialog,
            className: 'dialog',
          },
          // Example props that will be passed to the LoginDialog component
          // These props match type TLoginDialogProps
          returnPath,
          content,
        }}
      />
    </Route>
  )
};
```

## Size

5.14 KB with all dependencies, minified and gzipped
