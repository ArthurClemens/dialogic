# Dialogic for Svelte and SvelteKit

Manage dialogs and notifications.

See also the TypeScript version [dialogic-svelte-ts](../dialogic-svelte-ts/README.md).


- [API](#api)
- [Demo](#demo)
- [Installation](#installation)
  - [With SvelteKit](#with-sveltekit)
- [Usage](#usage)
  - [Dialog](#dialog)
  - [Notification](#notification)
  - [UseDialog](#usedialog)
  - [UseNotification](#usenotification)
- [Size](#size)

## API

See: [Main documentation](https://github.com/ArthurClemens/dialogic/blob/development/README.md)


## Demo

[Online demo](https://arthurclemens.github.io/dialogic/)

Demo code in this repo:
  * `./packages/demo-dialogic-svelte`
  * `./packages/demo-dialogic-svelte-router`
  * `./packages/demo-dialogic-sveltekit-router`

## Installation

`npm install dialogic-svelte`


### With SvelteKit

Include `dialogic-svelte` in package.json's "devDependencies" instead of "dependencies".

## Usage

### Dialog

```jsx
<!-- App.svelte -->
<script>
  import { dialog, Dialog } from "dialogic-svelte";
  import DialogView from "./DialogView.svelte";
</script>

<button
  on:click={() =>
    dialog.show({
      dialogic: {
        component: DialogView,
        class: "dialog"
      },
      title: "Dialog title"
    })
  }>
  Show dialog
</button>
<Dialog /> <!-- dialog will be drawn by this component -->

<style>
  :global(.dialog) {
    transition: opacity 350ms ease-in-out;
  }
  :global(.dialog-show-start) {
    opacity: 0;
  }
  :global(.dialog-show-end) {
    opacity: 1;
  }
  :global(.dialog-hide-start) {
    opacity: 1;
  }
  :global(.dialog-hide-end) {
    opacity: 0;
  }
</style>
```

```jsx
<!-- DialogView.svelte -->
<script>
  import { dialog } from "dialogic-svelte";
</script>$$

<div class="dialog">
  <div class="dialog-background" on:click={() => dialog.hide()}></div>
	<div class="dialog-content">
		<h3>{$$props.title}</h3>
		<div>Dialog content</div>
	</div>
</div>
```

### Notification

```jsx
<!-- App.svelte -->
<script>
  import { notification, Notification } from "dialogic-svelte";
  import NotificationView from "./NotificationView.svelte";
</script>

<button
  on:click={() =>
    notification.show({
      dialogic: {
        component: NotificationView,
        class: "notification"
      },
      title: "Notification title"
    })
  }>
  Show notification
</button>
<Notification /> <!-- notification will be drawn by this component -->

<style>
  :global(.notification) {
    transition: opacity 350ms ease-in-out;
  }
  :global(.notification-show-start) {
    opacity: 0;
  }
  :global(.notification-show-end) {
    opacity: 1;
  }
  :global(.notification-hide-start) {
    opacity: 1;
  }
  :global(.notification-hide-end) {
    opacity: 0;
  }
</style>
```

```jsx
<!-- NotificationView.svelte --->
<script>
  import { notification } from "dialogic-svelte";
  const notificationIsPaused = notification.isPaused();
</script>

<div class="notification">
  <div class="notification-content">
    <h3>{$$props.title}</h3>
    <div>
      <span>Message</span>
  
      <!-- Optionally using pause/resume/isPaused: -->
      <button on:click={() => {
        $notificationIsPaused
          ? notification.resume({ minimumDuration: 2000 })
          : notification.pause()
      }}>
        {#if $notificationIsPaused}
          <span>Continue</span>
        {:else}
          <span>Wait</span>
        {/if}
      </button>
    </div>
  </div>
</div>
```


### UseDialog

It is often desired to automatically show a dialog at a given route, so that it can be accessed by URL, and the browser back button will hide the dialog.

The component `UseDialog` allows for a declarative way of controlling dialogs. It will be shown when a condition is met (such as the current route), and automatically hidden as soon as the condition is no longer met.

This component is functionally equal to React's `UseDialog`. It accepts the same props as [useDialog](https://github.com/ArthurClemens/dialogic/blob/development/README.md#usedialog).

Example:

```jsx
<script>
  import { UseDialog } from 'dialogic-svelte';
  import { location } from 'svelte-spa-router'; // example routing library, here used to fetch the current route

  const dialogPath = '/profile/edit';
  const dialogReturnPath = '/profile';
  $: isMatchDialogPath = $location === dialogPath; // Update the match check whenever the route changes

  const useDialogProps = {
    dialogic: {
      component: EditProfileDialog,
      className: 'dialog',
    },
    title: 'Update your e-mail',
  };
</script>

<div class="page">
  <p>Contents</p>
  <UseDialog
    props={useDialogProps}
    isShow={isMatchDialogPath} />
</div>
```

To make the dialog content dynamic, make `useDialogProps` a reactive variable.

Assuming that `currentEmail` is reactive:

```js
$: useDialogProps = {
  dialogic: {
    component: EditProfileDialog,
    className: 'dialog',
  },
  title: `Your e-mail: ${$currentEmail}`,
};
```

and add the reactive variable to the `deps`:

```jsx
<UseDialog
  props={useDialogProps}
  isShow={isMatchDialogPath}
  deps={[$currentEmail]} />
```

### UseNotification

The component `UseNotification` has the same functionality as `UseDialog`.



## Size

```
┌─────────────────────────────────────────────┐
│                                             │
│   Bundle Name:  dialogic-svelte.module.js   │
│   Bundle Size:  60.42 KB                    │
│   Minified Size:  28.31 KB                  │
│   Gzipped Size:  8.7 KB                     │
│                                             │
└─────────────────────────────────────────────┘
```
