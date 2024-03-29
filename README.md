# Dialogic: manage dialogs and notifications

- [Supported JavaScript libraries](#supported-javascript-libraries)
- [Features](#features)
- [Demo](#demo)
- [Usage](#usage)
- [API](#api)
  - [Dialog and Notification component](#dialog-and-notification-component)
    - [Options](#options)
  - [`show`](#show)
  - [`hide`](#hide)
  - [`dialogic` options](#dialogic-options)
    - [`component`](#component)
    - [`className`](#classname)
    - [`styles`](#styles)
    - [`timeout`](#timeout)
    - [`queued`](#queued)
    - [`toggle`](#toggle)
    - [`willShow`](#willshow)
    - [`didShow`](#didshow)
    - [`willHide`](#willhide)
    - [`didHide`](#didhide)
    - [Component options](#component-options)
  - [`hideAll`](#hideall)
  - [`resetAll`](#resetall)
  - [Handling multiple items with identity options](#handling-multiple-items-with-identity-options)
    - [Simultaneous, at the same location](#simultaneous-at-the-same-location)
    - [Simultaneous, at different locations](#simultaneous-at-different-locations)
    - [Sequence of items](#sequence-of-items)
  - [`exists`](#exists)
  - [`getCount`](#getcount)
  - [Timer functions](#timer-functions)
    - [`pause`](#pause)
    - [`resume`](#resume)
    - [`isPaused`](#ispaused)
    - [`getRemaining`](#getremaining)
    - [`useRemaining`](#useremaining)
  - [Automatically responding to a variable state, such as a route](#automatically-responding-to-a-variable-state-such-as-a-route)
  - [`useDialog`](#usedialog)
    - [Options](#options-1)
    - [Calling show and hide directly](#calling-show-and-hide-directly)
- [Shout out](#shout-out)
- [License](#license)

## Supported JavaScript libraries

* React and NextJS - [Dialogic for React documentation](./packages/dialogic-react/README.md)
* Mithril - [Dialogic for Mithril documentation](./packages/dialogic-mithril/README.md)
* Svelte and SvelteKit - [Dialogic for Svelte documentation](./packages/dialogic-svelte/README.md)

For a more basic solution in vanilla JS, check out [dialogic-js](https://github.com/ArthurClemens/dialogic-js).


## Features

_item: a dialog/modal or a notification_

* Manage multiple items
  * Manage simultaneous (stacked) items
  * Manage a queue of items to show sequentially
* Optional automatic mode
  * Show and hide when matching a condition such as a route
* Transitions
  * Show and hide an item with specific transition options (or use CSS)
  * Handle separate spawn locations (for example for different types of notifications)
  * Replace an already displayed item
  * Hide all items, or only ones matching a specific id or spawn
  * Remove all items, or only ones matching a specific id or spawn
* Timer
  * Automatic timeout to hide items after a given time
  * Pause, resume and stop a timer
* State
  * Get the number of displayed items (all, per id or per spawn)
  * Get the paused state of a displayed item using a timer
  * Get the remaining time of a displayed item using a timer
  * Use a callback function when an item is shown or hidden
  * Use the returned Promise when an item is shown or hidden
* Styling 
  * Use custom CSS classes or style options
  * Manage timings with CSS (or use transition options)
  * Use any UI library
* Written in TypeScript 

Dialogic does __not__ provide any styling for dialogs or notifications. This gives you the freedom to plug into your own codebase or use any other UI library.


## Demo

[Demo page](https://arthurclemens.github.io/dialogic/)


## Usage

To create a dialog or notification, you need:

* Functions `show` and `hide`
* A Dialog / Notification component

The usage of the component varies somewhat per JS library - see library specific notes:

* [Dialogic for React](./packages/dialogic-react/README.md)
* [Dialogic for Mithril](./packages/dialogic-mithril/README.md)
* [Dialogic for Svelte and SvelteKit](./packages/dialogic-svelte/README.md)



## API

### Dialog and Notification component

Location where the dialog or notification (after this: "item") will be drawn.

With Mithril:

```javascript
m(Dialog)
m(Dialog, { spawn: "settings" })
```

With React:

```tsx
<Dialog />
<Dialog spawn="settings" />
```

With Svelte:

```tsx
<Dialog />
<Dialog spawn="settings" />
```

#### Options

| **Name** | **Type** | **Required** | **Description**                                                                                                                                                   | **Default value** |
|----------|----------|--------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------|
| `spawn`  | `string` | No           | Spawn identifier, useful when using multiple spawn locations. See [Handling multiple items with identity options](#handling-multiple-items-with-identity-options) | "default_spawn"   |


### `show`

Shows an item.

```javascript
dialog.show({
  dialogic: {
    component: DialogView,
    className: "dialog",
  },
  title: "Dialog Title"
})
```

* When `queued` is `true` (which is the default for notifications), any further call to `show` will queue the item and it will be displayed when the current item has transitioned to hidden.
* When an instance already exists, `show` replaces the content.


**Signature**

```typescript
show: <T>(options: Options<T>, componentOptions?: T) => Promise<Item<T>>;

type Dialogic.Options<T> = {
  dialogic?: DialogicOptions<T>;
} & T;
```


### `hide`

Hides an item.

```javascript
dialog.hide()
```

When identity options are used, only hides the item that match the identity options:

```javascript
dialog.hide({
  dialogic: {
    id: "settings", // example: use id and/or spawn
  }
})
```

**Signature**

```typescript
hide: <T>(options?: Options<T>, componentOptions?: T) => Promise<Item<T>>;

type Dialogic.Options<T> = {
  dialogic?: DialogicOptions<T>;
} & T;
```


### `dialogic` options

Options passed to `show`, `hide` and `hideAll`. The options are further explained below.

| **Name**              | **Type**                                                                     | **Required** | **Description**                                                                                                                                                         | **Default value**                          |
|-----------------------|------------------------------------------------------------------------------|--------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------|
| `component`           | Function component                                                           | No           | The component to render as an item.                                                                                                                                     |                                            |
| `className`           | `string`                                                                     | No           | Class added to the wrapper around `component`; also the base name for transition classes (more below).                                                                  |                                            |
| `styles`              | `TransitionStyles` object or `(domElement: HTMLElement) => TransitionStyles` | No           | Pass transition styles in JS.                                                                                                                                           |                                            |
| `timeout`             | `number` (ms)                                                                | No           | Creates a timer. When the dialog is completely shown the timer is started automatically. After timeout the dialog is hidden. Use `0` to prevent the timer from running. | For notifications `3000`                   |
| `queued`              | `boolean`                                                                    | No           | Set to `true` to manage multiple dialogs in time (more useful for notifications).                                                                                       | `false`; for notifications `true`          |
| `toggle`              | `boolean`                                                                    | No           | Set to `true` to make `show()` switch between shown and hidden state.                                                                                                   | `false`                                    |
| `willShow`            | `(item: Dialogic.Item) => void`                                              | No           | Function called just before the item will be shown (before transitioning).                                                                                              |                                            |
| `didShow`             | `(item: Dialogic.Item) => void`                                              | No           | Function called when the item is completely shown (after transitioning).                                                                                                |                                            |
| `willHide`            | `(item: Dialogic.Item) => void`                                              | No           | Function called just before the item will be hidden (before transitioning).                                                                                             |                                            |
| `didHide`             | `(item: Dialogic.Item) => void`                                              | No           | Function called when the item is completely hidden (after transitioning).                                                                                               |                                            |
| `id`                  | `string`                                                                     | No           | Dialog identifier, useful when using multiple (stacked) items. See [Handling multiple items with identity options](#handling-multiple-items-with-identity-options)      | "default_dialog" or "default_notification" |
| `spawn`               | `string`                                                                     | No           | Spawn identifier, useful when using multiple spawn locations. See [Handling multiple items with identity options](#handling-multiple-items-with-identity-options)       | "default_spawn"                            |
| `...componentOptions` | `any`                                                                        | No           | Options to pass to the `component`.                                                                                                                                     |                                            |


**Signature**

```typescript
type IdentityOptions = {
  id?: string;
  spawn?: string;
}

type DialogicOptions<T> = {
  className?: string;
  component?: any;
  willShow?: ConfirmFn<T>;
  didShow?: ConfirmFn<T>;
  willHide?: ConfirmFn<T>;
  didHide?: ConfirmFn<T>;
  domElement?: HTMLElement;
  queued?: boolean;
  styles?: TransitionStyles | TransitionStylesFn;
  timeout?: number;
  toggle?: boolean;
} & IdentityOptions;

type ConfirmFn<T> = (item: Item<T>) => void;
```

For more type information, see [index.d.ts](https://github.com/ArthurClemens/dialogic/blob/development/packages/dialogic/index.d.ts).



#### `component`

Pass the component that will be rendered.

* [Example with Mithril](./packages/dialogic-mithril/README.md#component)


#### `className`

Create transitions by writing styles using the format `className-suffix` - where suffix is defined by its transition point.

| **Class suffix** | **When is the class set** | **What should the style do**                                               |
|------------------|---------------------------|----------------------------------------------------------------------------|
| `-show-start`    | Start of show transition  | Initial state before the item is shown                                     |
| `-show-end`      | End of show transition    | State for the shown item, including the transition (properties, duration)  |
| `-hide-start`    | Start of hide transition  | Initial state before the item is hidden                                    |
| `-hide-end`      | End of hide transition    | State for the hidden item, including the transition (properties, duration) |


Define those classes in CSS to create transitions. For example with `className` "dialog":

```css
.dialog {
  transition: opacity 300ms ease-in-out;
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

Use regular CSS syntax to define delays. Note that delays should be written at the "end" transition.

In this example, the dialog will transition towards the end fully visible and with a delay of half a second:

```css
.dialog-show-end {
  opacity: 1;
  transition-delay: 500ms;
}
```



#### `styles`

Pass a style object in JavaScript instead of using a CSS file. This allows for more dynamic styling based on the current element state.

| **Property** | **When is the style read**                                                                     | **What should the style do**                                               |
|--------------|------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------|
| `default`    | The default style is read at every transition moment and combined with the other styles below. | Anything that saves duplication.                                           |
| `showStart`  | Start of show transition                                                                       | Initial state before the item is shown                                     |
| `showEnd`    | End of show transition                                                                         | State for the shown item, including the transition (properties, duration)  |
| `hideStart`  | Start of hide transition                                                                       | Initial state before the item is hidden                                    |
| `hideEnd`    | End of hide transition                                                                         | State for the hidden item, including the transition (properties, duration) |

Either pass a styles object, or pass a function that returns the styles object. Because the function accepts the item's DOM elemment, styles can be modified by the current DOM state.

The object is read again for every transition, so in this example the `height` of the DOM element always reads the current height at that moment.

```javascript
styles: (domElement: HTMLElement) => {
  const height = domElement.getBoundingClientRect().height

  return {
    default: {
      transition: "all 300ms ease-in-out",
    },
    showStart: {
      opacity: "0",
      transform: `translate3d(0, ${height}px, 0)`,
    },
    showEnd: {
      opacity: "1",
      transform: "translate3d(0, 0px,  0)",
    },
    hideEnd: {
      transitionDuration: "450ms",
      transform: `translate3d(0, ${height}px, 0)`,
      opacity: "0",
    },
  }
}

dialog.show({
  dialogic: {
    styles
  },
})
```


#### `timeout`

Creates a timer. The timer starts when the item is completely shown. After timeout the item will be hidden. Use `0` to prevent the timer from running.

```javascript
dialog.show({
  dialogic: {
    timeout: 3000 // in ms
  },
})
```

See also: [timer functions](timer-functions)


#### `queued`

When `true`, items are shown sequentially, instead of replacing the previous item (when using the same `id` and `spawn`) or shown simultaneously (when using a different `id` or `spawn`).

`notification` is queued by default, so no additional setting is needed.

```javascript
dialog.show({
  dialogic: {
    queued: true
  },
})
```


#### `toggle`

Set to `true` to make `dialog.show()` switch between shown and hidden state.

So to show and to hide a dialog, use:

```javascript
dialog.show({
  dialogic: {
    toggle: true
  },
})
```


#### `willShow`

Function called just before the item will be shown (before transitioning).

```javascript
dialog.show({
  dialogic: {
    willShow: (item) => {
      // before the item will be shown
    }
  },
})
```

#### `didShow`

Function called when the item is completely shown (after transitioning).

```javascript
dialog.show({
  dialogic: {
    didShow: (item) => {
      // item is shown
    }
  },
})
```

#### `willHide`

Function called just before the item will be hidden (before transitioning).

```javascript
dialog.show({
  dialogic: {
    didHide: (item) => {
      // before the item will be hidden
    }
  },
})
```

#### `didHide`

Function called when the item is completely hidden (after transitioning).

```javascript
dialog.show({
  dialogic: {
    didHide: (item) => {
      // item is hidden
    }
  },
})
```

#### Component options

Alls options that are passed to the show functions, except for `dialogic`, are passed to the component.

Here the component receives option `title`:

```javascript
dialog.show({
  dialogic: {
    component: DialogView,
  },
  title: "Dialog Title"
})
```


### `hideAll`

Hides all items. All items are transitioned to their hide state.

For queued items only the first item will be transitioned - the remaining items will be removed from the queue.

```javascript
dialog.hideAll()
```

When identity options are used, only hides the items that match the identity options:

```javascript
dialog.hideAll({
  id: "settings", // example: use id and/or spawn
})
```

Optional `dialogicOptions` may be passed with specific transition options. This comes in handy when all items should hide in the same way.

```javascript
const hideAllStyles = {
  showEnd: {
    opacity: "1",
  },
  hideEnd: {
    transition: "all 450ms ease-in-out",
    opacity: "0",
  },
}

dialog.hideAll({
  styles: hideAllStyles
})
```


**Signature**

```typescript
hideAll: (dialogicOptions?: DialogicOptions<unknown>) => Promise<Item<T>[]>;
```


### `resetAll`

Resets and hides all items. All items are reset without any transitions.

```javascript
dialog.resetAll()
```

When identity options are used, only resets the items that match the identity options:

```javascript
dialog.resetAll({
  id: "settings", // example: use id and/or spawn
})
```

**Signature**

```typescript
resetAll: (identityOptions?: IdentityOptions) => Promise<Item<unknown>[]>;
```


### Handling multiple items with identity options

Dialogic can handle multiple items in space (simulaneous view) and in time (sequential view).

Dialogs and notifications each have their own namespace and are handled separately.

* `dialog`: namespace "dialog"
* `notification`: namespace "notification"

Items can further be differentiated using identity options:

* `id` - Differentiates simulaneous items.
* `spawn` - Diffentiates locations from where to show items. Each Dialog or Notification component has its own `spawn` identifier.

When no `id` or `spawn` is passed, default names are used.


#### Simultaneous, at the same location

```javascript
dialog.show({
  dialogic: {
    id: "profile",
  },
  title: "Profile dialog"
})

dialog.show({
  dialogic: {
    id: "confirm",
  },
  title: "Confirm deletion of profile"
})
```

#### Simultaneous, at different locations

```javascript
dialog.show({
  dialogic: {
    spawn: "main",
  },
  title: "Main dialog"
})

dialog.show({
  dialogic: {
    spawn: "settings",
  },
  title: "Settings dialog"
})
```

Each spawn identifier refers to a Dialog or Notification component.

With Mithril:

```javascript
m(Dialog, { spawn: "main" })
m(Dialog, { spawn: "settings" })
```

With React:

```tsx
<Dialog spawn="1" />
<Dialog spawn="settings" />
```

With Svelte:

```javascript
<Dialog spawn="1" />
<Dialog spawn="settings" />
```


#### Sequence of items

To show a sequence of items, option `queued` must be set to `true`. `notification` is queued by default, so no additional setting is needed.



### `exists`

Returns a boolean that indicates if an item with given identity options is displayed.

To check if any dialog exists:

```javascript
const exists = dialog.exists()
```

When identity options are used, only checks for items that match the identity options:

```javascript
const exists = dialog.exists({
  id: "settings", // example: use id and/or spawn
})
```

**Signature**

```typescript
exists: (identityOptions?: IdentityOptions) => boolean
```

React: requires [useDialogicState](./packages/dialogic-react/README.md#usedialogicstate).


### `getCount`

Returns the number of items. Also counts the queued items that are not yet displayed.

```javascript
const count = notification.getCount()
```

When identity options are used, only resets the items that match the identity options:

```javascript
const count = notification.getCount({
  id: "settings", // example: use id and/or spawn
})
```

**Signature**

```typescript
getCount: (identityOptions?: IdentityOptions) => number;
```

React: requires [useDialogicState](./packages/dialogic-react/README.md#usedialogicstate).


### Timer functions

#### `pause`

Pauses an item if it has a timer.

Without identity options, `pause` will pause all items within the same namespace (so: all notifications, or all dialogs):

```javascript
notification.pause()
```

When identity options are used, pauses the items (within the same namespace) that match the identity options:

```javascript
notification.pause({
  id: "settings", // example: use id and/or spawn
})
```

**Signature**

```typescript
pause: (identityOptions?: IdentityOptions) => Promise<Item<T>[]>;
```


#### `resume`

Resumes a paused item.

Without identity options, `resume` will resume all paused items within the same namespace (so: all notifications, or all dialogs):

```javascript
notification.resume()
```

When identity options are used, resumes the items (within the same namespace) that match the identity options:

```javascript
notification.resume({
  id: "settings", // example: use id and/or spawn
})
```

Optional `minimumDuration` can be passed to nudge the timer so it will show at least for `minimumDuration` ms:

```javascript
notification.resume({
  minimumDuration: 3000
})
```


**Signature**

```typescript
resume: (commandOptions?: CommandOptions) => Promise<Item<T>[]>;

type CommandOptions = IdentityOptions & TimerResumeOptions;

type TimerResumeOptions = {
  minimumDuration?: number;
}
```


#### `isPaused`

Returns whether an item has been paused.

```javascript
notification.isPaused()
```

When identity options are used, finds the item that matches the identity:

```javascript
notification.isPaused({
  id: "settings", // example: use id and/or spawn
})
```


**Signature**

```typescript
isPaused: (identityOptions?: IdentityOptionsg) => boolean;
```

React: requires [useDialogicState](./packages/dialogic-react/README.md#usedialogicstate).


#### `getRemaining`

Returns the remaining timer duration in ms.

```javascript
const remaining = notification.getRemaining()
```

When identity options are used, finds the item that matches the identity:

```javascript
const remaining = notification.getRemaining({
  id: "settings", // example: use id and/or spawn
})
```

**Signature**

```typescript
getRemaining: (identityOptions?: IdentityOptions) => number | undefined;
```

React: requires [useDialogicState](./packages/dialogic-react/README.md#usedialogicstate).


#### `useRemaining` 

Hook that continuously returns the current remaining time.

* Mithril: this is an alternative for [`getRemaining`](#getremaining).
* React: use this to get the remaining time. See: [useRemaining](./packages/dialogic-react/README.md#useremaining).


**Signature**

```typescript
useRemaining: (props: UseRemainingProps) => (number | undefined)[];

type UseRemainingProps = {
  instance: Dialogic.DialogicInstance;
  id?: string;
  spawn?: string;

  /**
   * Set to true to return seconds instead of milliseconds.
   */
  roundToSeconds?: boolean;
};
```


### Automatically responding to a variable state, such as a route

It is often desired to automatically show a dialog at a given route, so that it can be accessed by URL, and the browser back button will hide the dialog.

A common pattern is to create a Route that contains the dialog component. A React example with React Router:

```tsx
import { Route, useRouteMatch } from 'react-router-dom';

const match = useRouteMatch();
const dialogPath = `${match.url}/edit`;

<Route path={dialogPath}>
  // Dialog should appear here
</Route>
```

The hooks `useDialogic`, `useDialog` and `useNotification`  allow for a declarative way of controlling elements. The element will be shown when a condition is met (such as the current route), and automatically hidden as soon as the condition is no longer met.

* `useDialog` - `useDialogic` with `instance` preset to `dialog`.
  * For Svelte: use component `UseDialog`
* `useNotification` - `useDialogic` with `instance` preset to `notification`.
  * For Svelte: use component `UseNotification` 
* `useDialogic` - generic hook that accepts `instance` of type `Dialogic.DialogicInstance`.
  * For Svelte: use component `useDialogic` 




### `useDialog`

_For Svelte: use component [UseDialog](./packages/dialogic-svelte/README.md#usedialog)_

This is a hook to automatically show a dialog when a condition is met, for instance on URL location match. The dialog will hide when the condition is no longer met.

In the following example the dialog is shown when the URL location matches the given path. This is an example for React, but the Mithril version is very similar - see the [Mithril documentation](./packages/dialogic-mithril/README.md).

```ts
import { useDialog } from 'dialogic-react';
import { MyDialog } from './MyDialog';

const MyComponent = () => {
  const returnPath = '/';
  const dialogPath = '/some-path';

  useDialog({
    isShow: window.location.pathname === dialogPath,
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

useDialog<TDialogProps>({
  isShow: window.location.pathname === dialogPath && !!content,
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

#### Options

| **Name** | **Type**               | **Required** | **Description**                                                                                                                                                                                            | **Default value** |
|----------|------------------------|--------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------|
| `isShow` | `boolean`              | Yes          | A boolean value when to show the dialog.                                                                                                                                                                   | None              |
| `deps`   | `React.DependencyList` | No           | Update the hook with these deps. Use this when the instance should appear conditionally, for instance only when content exists. Can be omitted when all content is static, so no re-rendering takes place. | `[]`              |
| `props`  | `object`               | No           | Props to pass to the dialog.                                                                                                                                                                               | None              |


#### Calling show and hide directly

`useDialog` returns methods `show` and `hide`. Using these methods you can invoke dialogs just like `dialog.show` and `dialog.hide`, with the addition that an extra condition can be set when to automatically hide the dialog.

In the example below:

* `show` is used to show the dialog
* Component MyDialog receives props `hideDialog` to explicitly hide the dialog
* `deps` includes the URL location - whenever it changes the dialog is hidden

_See the [Mithril documentation](./packages/dialogic-mithril/README.md) for a Mithril specific example._

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

**Options for directed use**

All options listed above, plus:

| **Name** | **Type**  | **Required** | **Description**                                                                                   | **Default value** |
|----------|-----------|--------------|---------------------------------------------------------------------------------------------------|-------------------|
| `isHide` | `boolean` | No           | Only for directed use. A boolean value when to hide the dialog. Can be used together with `deps`. | None              |



## Shout out

Dialogic uses the [Meiosis state pattern](http://meiosis.js.org/) for state management.


## License

MIT
