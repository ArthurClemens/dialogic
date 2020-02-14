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
    - [`didShow`](#didshow)
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
    - [Getting updates on the remaining time](#getting-updates-on-the-remaining-time)
    - [`useRemaining`](#useremaining)
  - [`useDialogicState`](#usedialogicstate)
- [Size](#size)
- [License](#license)

## Supported JavaScript libraries

* React - [Dialogic for React documentation](./packages/dialogic-react/README.md)
* Mithril - [Dialogic for Mithril documentation](./packages/dialogic-mithril/README.md)
* Svelte - [Dialogic for Svelte documentation](./packages/dialogic-svelte/README.md)


## Features

_item: a dialog/modal or a notification_

* Manage multiple items
  * Manage simultaneous (stacked) items
  * Manage a queue of items to show one after the other
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
* [Dialogic for Svelte](./packages/dialogic-svelte/README.md)



## API

### Dialog and Notification component

Location where the dialog or notification (after this: "item") will be drawn.

With Mithril:

```javascript
m(Dialog)
m(Dialog, { spawn: "settings" })
```

With React:

```jsx
<Dialog />
<Dialog spawn="settings" />
```

With Svelte:

```jsx
<Dialog />
<Dialog spawn="settings" />
```

#### Options

| **Name** | **Type** | **Required** | **Description** | **Default value** |
| --- | --- | --- | --- | --- | 
| `spawn` | `string` | No | Spawn identifier, useful when using multiple spawn locations. See [Handling multiple items with identity options](#handling-multiple-items-with-identity-options) | "default_spawn" |


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

When `queued` is `true` (which is the default for notifications), any further call to `show` will queue the item and it will be displayed when the current item has transitioned to hidden.


**Signature**

```typescript
type Options = {
  dialogic?: DialogicOptions; // see below
} & PassThroughOptions;

type PassThroughOptions = {
  [key:string]: any;
}

show: (options: Options, componentOptions?: PassThroughOptions) => Promise<Item>;
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
type Options = {
  dialogic?: DialogicOptions; // see below
}

type PassThroughOptions = {
  [key:string]: any;
}

hide: (options?: Options, componentOptions?: PassThroughOptions) => Promise<Item>;
```



### `dialogic` options

Options passed to `show`, `hide` and `hideAll`. The options are further explained below.

| **Name** | **Type** | **Required** | **Description** | **Default value** |
| --- | --- | --- | --- | --- | 
| `component` | Function component | No | The component to render as an item. | |
| `className` | `string` | No | Class added to the wrapper around `component`; also the base name for transition classes (more below). | | 
| `styles` | `TransitionStyles` object or `(domElement: HTMLElement) => TransitionStyles` | No | Pass transition styles in JS. |  |
| `timeout` | `number` (ms) | No | Creates a timer. When the dialog is completely shown the timer is started automatically. After timeout the dialog is hidden. Use `0` to prevent the timer from running. | For notifications `3000` | 
| `queued`  | `boolean` | No | Set to `true` to manage multiple dialogs in time (more useful for notifications). | `false`; for notifications `true` | 
| `toggle`  | `boolean` | No | Set to `true` to make `show()` switch between shown and hidden state. | `false` | 
| `didShow` | `(item: Dialogic.Item) => void` | No | Function called when the item is completely shown (after transitioning). | |
| `didHide` | `(item: Dialogic.Item) => void` | No | Function called when the item is completely hidden (after transitioning). | |
| `id` | `string` | No | Dialog identifier, useful when using multiple (stacked) items. See [Handling multiple items with identity options](#handling-multiple-items-with-identity-options) | "default_dialog" or "default_notification" |
| `spawn` | `string` | No | Spawn identifier, useful when using multiple spawn locations. See [Handling multiple items with identity options](#handling-multiple-items-with-identity-options) | "default_spawn" |
| `...componentOptions` | `any` | No | Options to pass to the `component`. |  |


**Signature**

```typescript
type IdentityOptions = {
  id?: string;
  spawn?: string;
}

type DialogicOptions = {
  className?: string;
  component?: any;
  didHide?: ConfirmFn;
  didShow?: ConfirmFn;
  domElement?: HTMLElement;
  queued?: boolean;
  styles?: TransitionStyles | TransitionStylesFn;
  timeout?: number;
  toggle?: boolean;
} & IdentityOptions;
```

For more type information, see [index.d.ts](https://github.com/ArthurClemens/dialogic/blob/development/packages/dialogic/index.d.ts).



#### `component`

Pass the component that will be rendered.

* [Example with Mithril](./packages/dialogic-mithril/README.md#component)


#### `className`

Create transitions by writing styles using the format `className-suffix` - where suffix is defined by its transition point.

| **Class suffix** | **When is the class set** | **What should the style do** |
| --- | --- | --- |
| `-show-start` | Start of show transition | Initial state before the item is shown |
| `-show-end`   | End of show transition | State for the shown item, including the transition (properties, duration) |
| `-hide-start` | Start of hide transition | Initial state before the item is hidden |
| `-hide-end`   | End of hide transition | State for the hidden item, including the transition (properties, duration) |


Define those classes in CSS to create transitions. For example with `className` "dialog":

```css
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

| **Property** | **When is the style read** | **What should the style do** |
| --- | --- | --- |
| `default`   | The default style is read at every transition moment and combined with the other styles below. | Anything that saves duplication. |
| `showStart` | Start of show transition | Initial state before the item is shown |
| `showEnd`   | End of show transition | State for the shown item, including the transition (properties, duration) |
| `hideStart` | Start of hide transition | Initial state before the item is hidden |
| `hideEnd`   | End of hide transition | State for the hidden item, including the transition (properties, duration) |

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
hideAll: (dialogicOptions?: DialogicOptions) => Promise<Item[]>;
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
resetAll: (identityOptions?: IdentityOptions) => Promise<Item[]>;
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

```jsx
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
exists: (identityOptions?: IdentityOptions) => boolean;
```

React: requires `useDialogicState`.


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

React: requires `useDialogicState`.


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
pause: (identityOptions?: IdentityOptions) => Promise<Item[]>;
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
type TimerResumeOptions = {
  minimumDuration?: number;
}
type CommandOptions = IdentityOptions & TimerResumeOptions;

resume: (commandOptions?: CommandOptions) => Promise<Item[]>;
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
isPaused: (identityOptions?: IdentityOptions) => boolean;
```

React: requires `useDialogicState`.


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

React: requires `useDialogicState`.


#### Getting updates on the remaining time

The `dialogic` module contains a helper function `remaining` that continuously returns the current remaining time.

See the demos for an example.

When using React, you can use the hook `useRemaining` (see below).


#### `useRemaining` 

For React only.

Hook to fetch the current remaining time.

```jsx
import { notification, useRemaining } from "dialogic-react";

const MyComponent = props => {
  const [remainingSeconds] = useRemaining({ instance: notification, roundToSeconds: true });
  // ...
}
```

### `useDialogicState` 

For React only.

To retrieve the current state, hook `useDialogicState` should be called:

```jsx
import { dialog, useDialogicState } from "dialogic-react";

const MyComponent = props => {
  useDialogicState();

  return (
    <div>{dialog.getCount()}</div>
  )
}
```

## Size

* Dialogic for React: 4.5 Kb gzipped
* Dialogic for Mithril: 4.3 Kb gzipped
* Dialogic for Svelte: 7.5 Kb gzipped

## License

MIT
