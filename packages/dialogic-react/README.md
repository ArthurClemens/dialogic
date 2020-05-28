# Dialogic for React


- [API](#api)
- [Demo](#demo)
- [Usage](#usage)
  - [Dialog](#dialog)
  - [Notification](#notification)
  - [useDialog](#usedialog)
    - [Dialog routes](#dialog-routes)
    - [useDialog hook](#usedialog-hook)
      - [Options](#options)
      - [Good to know](#good-to-know)
      - [Calling show and hide directly](#calling-show-and-hide-directly)
      - [All hooks](#all-hooks)
      - [With React Router](#with-react-router)
    - [UseDialog component](#usedialog-component)
      - [All helper components](#all-helper-components)
      - [Example](#example)
- [Size](#size)

## API

See: [Main documentation](https://github.com/ArthurClemens/dialogic/blob/development/README.md)


## Demo

* [Demo page](https://arthurclemens.github.io/dialogic/)
* [Route example with useDialog](https://codesandbox.io/s/dialogic-for-react-route-example-with-usedialog-cutrx)
* [Route example with UseDialog component](https://codesandbox.io/s/dialogic-for-react-route-example-with-usedialog-component-kgq22)

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

### useDialog

#### Dialog routes

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

The `useDialog` hook facilitates showing and hiding based on a condition such as the current route.


#### useDialog hook

This is a Hook to automatically show a dialog when a condition is met, for instance on URL location match. The dialog will hide when the condition is no longer met.

In the following example the dialog is shown when the URL location matches the given path:

```ts
import { useDialog } from 'dialogic-react';
import { MyDialog } from './MyDialog';

const MyComponent = () => {
  const returnPath = '/';
  const dialogPath = '/some-path';

  useDialog({
    show: window.location.pathname === dialogPath,
    props: {
      dialogic: {
        component: MyDialog,
        className: 'dialog',
        queued: true,
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

useDialog<TDialogProps>({
  show: window.location.pathname === dialogPath && !!content,
  deps: [content],
  props: {
    dialogic: {
      component: MyDialog,
      className: 'dialog',
      queued: true,
    },
    // Props that will be passed to the MyDialog component
    // These props match type TDialogProps
    returnPath,
    content,
  }
})
```

##### Options

| **Name**     | **Type**               | **Required** | **Description**                                                                                                                                                                                            | **Default value** |
| ------------ | ---------------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| `show`       | `boolean`              | Yes          | A boolean value when to show the dialog.                                                                                                                                                                   | None              |
| `deps`       | `React.DependencyList` | No           | Update the hook with these deps. Use this when the instance should appear conditionally, for instance only when content exists. Can be omitted when all content is static, so no re-rendering takes place. | `[]`              |
| `props`      | `object`               | No           | Props to pass to the dialog.                                                                                                                                                                               | None              |
| `beforeShow` | `() => void`           | No           | Function called just before instance.show() is called. This moment could be used to store the current scroll position.                                                                                     | None              |
| `beforeHide` | `() => void`           | No           | Function called just before instance.hide() is called. This moment could be used to resstore the scroll position.                                                                                          | None              |


##### Good to know

To improve stability when quickly toggling showing/hiding (which can happen with frantically navigating back and forth in the browser), set dialogic option `queued` to `true`.


##### Calling show and hide directly

`useDialog` returns methods `show` and `hide`. Using these methods you can invoke dialogs just like `dialog.show` and `dialog.hide`, with the addition that an extra condition can be set when to automatically hide the dialog.

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
        queued: true,
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

**Options for directed use**

All options listed above, plus:

| **Name** | **Type**  | **Required** | **Description**                                                                                   | **Default value** |
| -------- | --------- | ------------ | ------------------------------------------------------------------------------------------------- | ----------------- |
| `hide`   | `boolean` | No           | Only for directed use. A boolean value when to hide the dialog. Can be used together with `deps`. | None              |


##### All hooks

* `useDialogic` - generic hook that accepts `instance` of type `Dialogic.DialogicInstance`.
* `useDialog` - `useDialogic` with `instance` preset to `dialog`.
* `useNotification` - `useDialogic` with `instance` preset to `notification`.


##### With React Router

Use `react-router` matching for more flexibility on matching routes. This can also be used to match on parametrized routes.

See also CodeSandbox demo: [Route example with useDialog](https://codesandbox.io/s/dialogic-for-react-route-example-with-usedialog-cutrx).


```js
import { useRouteMatch } from 'react-router-dom';

const dialogPath = '/profile/:name';
const matchDialogPath = useRouteMatch(dialogPath);

useDialog({
  show: !!matchDialogPath,
  ...
});
```

To only show the dialog on exact matches:

```js
useDialog({
  show: matchDialogPath ? matchDialogPath.isExact : false,
  ...
});
```





#### UseDialog component

Helper component that wraps `useDialog` to use in JSX syntax, for example together with React Router.

It accepts the same props as `useDialog`.

##### All helper components

* `UseDialogic` - generic component that accepts `instance` of type `Dialogic.DialogicInstance`.
* `UseDialog` - `UseDialogic` with `instance` preset to `dialog`.
* `UseNotification` - `UseDialogic` with `instance` preset to `notification`.


##### Example

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

  return (
    <Route path={dialogPath}>
      <UseDialog
        show={history.location.pathname === dialogPath && !!content}
        deps={[content]}
        props={{
          dialogic: {
            component: MyDialog,
            className: 'dialog',
            queued: true,
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

  return (
    <Route path={dialogPath}>
      <UseDialog<TDialogProps>
        show={history.location.pathname === dialogPath && !!content}
        deps={[content]}
        props={{
          dialogic: {
            component: MyDialog,
            className: 'dialog',
            queued: true,
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

## Size

5.08 KB with all dependencies, minified and gzipped
