# Dialogic: manage dialogs and notifications

- [Supported JavaScript libraries](#supported-javascript-libraries)
- [Features](#features)
- [Status](#status)
- [Usage](#usage)
- [API](#api)
  - [Dialog and Notification component](#dialog-and-notification-component)
    - [Options](#options)
  - [`show`](#show)
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
  - [`hide`](#hide)
    - [`dialogic` options](#dialogic-options-1)
  - [Handling multiple items with identity options](#handling-multiple-items-with-identity-options)
    - [Simultaneous, at the same location](#simultaneous-at-the-same-location)
    - [Simultaneous, at different locations](#simultaneous-at-different-locations)
    - [Sequence of items](#sequence-of-items)
- [TODO](#todo)
- [Size](#size)
- [License](#license)

## Supported JavaScript libraries

* React
* Mithril
* Svelte

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

## Status

* Core functionality: stable
* Tests: complete
* Documentation: in progress
* Demos: TODO


## Usage

To create a dialog or notification, you need:

* Functions `show` and `hide`
* A Dialog / Notification component

The usage of the component varies somewhat per JS library - see library specific notes:

* [Dialogic for React](./packages/dialogic-mithril/README.md)
* [Dialogic for Mithril](./packages/dialogic-react/README.md)
* [Dialogic for Svelte](./packages/dialogic-svelte/README.md)



## API

### Dialog and Notification component

Location where the dialog or notification (hereafter: "item") will be drawn.

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

```javascript
<Dialog />
<Dialog spawn="settings" />
```

#### Options

| **Name** | **Type** | **Required** | **Description** | **Default value** |
| --- | --- | --- | --- | --- | 
| `spawn` | `string` | No | Spawn identifier, useful when using multiple spawn locations. See [Handling multiple items with identity options](#handling-multiple-items-with-identity-options) | "default_spawn" |


### `show`

Shows a dialog.

```javascript
dialog.show({
  dialogic: {
    component: DialogView,
    className: "dialog",
  },
  title: "Dialog Title"
})
```

**Signature**

`dialog.show({ dialogic: itemProps, ...componentProps }) => Promise<Item>`

`notification.show({ dialogic: itemProps, ...componentProps }) => Promise<Item>`

See [index.d.ts](https://github.com/ArthurClemens/dialogic/blob/development/packages/dialogic/index.d.ts) for more type information.


#### `dialogic` options

Options are explained in more detail below.

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
| `...componentProps` | `object` | No | Options to pass to the `component`. |  |
| **Returns** | `Promise<Item>` |||



##### `component`

Pass the component that will be rendered.

* [Example with Mithril](./packages/dialogic-mithril/README.md#component)


##### `className`

Create transitions by writing styles using the format `className-suffix` - where suffix is defined by its transition point.

| **Class suffix** | **When is the class set** | **What should the style do** |
| --- | --- | --- |
| `-show-start` | Start of show transition | Initial state before the item is shown |
| `-show-end`   | End of show transition | State for the shown item, including the transition (properties, duration) |
| `-hide-start` | Start of hide transition | Initial state before the item is hidden |
| `-hide-end`   | End of hide transition | State for the hidden item, including the transition (properties, duration) |


Define those classes in CSS to create transitions. For example with `className` "dialog":

```css
.dialog-show-start {
  opacity: 0;
}
.dialog-show-end {
  opacity: 1;
  transition: opacity 300ms;
}
.dialog-hide-start {
  opacity: 1;
}
.dialog-hide-end {
  opacity: 0;
  transition: opacity 300ms;
}
```

##### `styles`

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
  const height = domElement.getBoundingClientRect().height;
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


##### `timeout`

Creates a timer. The timer starts when the item is completely shown. After timeout the item will be hidden. Use `0` to prevent the timer from running.

```javascript
dialog.show({
  dialogic: {
    timeout: 3000
  },
})
```

Additional timer functions:

```javascript
dialog.pause()
dialog.resume()
```

See: timer functions.



##### `queued`

When `true`, items are shown sequentially, instead of replacing the previous item (when using the same `id` and `spawn`) or shown simultaneously (when using a different `id` or `spawn`).

`notification` is queued by default, so no additional setting is needed.

```javascript
dialog.show({
  dialogic: {
    queued: true
  },
})
```


##### `toggle`

Set to `true` to make `dialog.show()` switch between shown and hidden state.

So to show and to hide a dialog, use:

```javascript
dialog.show({
  dialogic: {
    toggle: true
  },
})
```


##### `didShow`

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

##### `didHide`

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

### `hide`

Hides an item.

```javascript
dialog.hide()
```

When identity options are used:

```javascript
dialog.show({
  dialogic: {
    id: "settings",
    // and/or spawn
  }
})
```

```javascript
dialog.hide({
  id: "settings",
  // and/or spawn
})
```


**Signature**

`dialog.hide(identityProps) => Promise<Item>`

`notification.hide(identityProps) => Promise<Item>`

See [index.d.ts](https://github.com/ArthurClemens/dialogic/blob/development/packages/dialogic/index.d.ts) for more type information.

#### `dialogic` options

Options are explained in more detail below.

| **Name** | **Type** | **Required** | **Description** | **Default value** |
| --- | --- | --- | --- | --- | 
| `id` | `string` | No | Dialog identifier, useful when using multiple (stacked) items. See [Handling multiple items with identity options](#handling-multiple-items-with-identity-options) | "default_dialog" or "default_notification" |
| `spawn` | `string` | No | Spawn identifier, useful when using multiple spawn locations. See [Handling multiple items with identity options](#handling-multiple-items-with-identity-options) | "default_spawn" |
| **Returns** | `Promise<Item>` |||



### Handling multiple items with identity options

Dialogic can handle multiple items in space (simulaneous view) and in time (sequential view).

Items can be differentiate using identity options:

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



## TODO



* hideAll
* resetAll
* exists
* getCount
* timer functions: pause, resume (minimumDuration)
* isPaused, getRemaining



## Size

* Dialogic for React: 4.3 Kb gzipped
* Dialogic for Mithril: 4.2 Kb gzipped
* Dialogic for Svelte: 7.4 Kb gzipped

## License

MIT
