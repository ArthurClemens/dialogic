# Dialogic for Svelte

Manage dialogs and notifications.

- [API](#api)
- [Demo](#demo)
- [Usage](#usage)
  - [Dialog](#dialog)
  - [Notification](#notification)
- [Size](#size)


## API

See: [Main documentation](https://github.com/ArthurClemens/dialogic/blob/development/README.md)

## Demo

[Demo page](https://arthurclemens.github.io/dialogic/)


## Usage

### Dialog

```html
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

```html
<!-- DialogView.svelte -->
<script>
  import { dialog } from "dialogic-svelte";
</script>

<div class="dialog">
  <div class="dialog-background" on:click={() => dialog.hide()}></div>
	<div class="dialog-content">
		<h3>{$$props.title}</h3>
		<div>Dialog content</div>
	</div>
</div>
```

### Notification

```html
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

```html
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

## Size

7.34 KB with all dependencies, minified and gzipped
