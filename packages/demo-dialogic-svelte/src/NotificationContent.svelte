<script>
  import { remaining } from "dialogic";
  import {
    dialog,
    notification,
  } from "../../dialogic-svelte-ts/dist/dialogic-svelte.es";
  import DialogComponent from "./DialogComponent.svelte";

  let remainingSeconds;

  remaining({
    instance: notification,
    roundToSeconds: true,
    callback: (newValue) => {
      remainingSeconds = newValue;
    },
  });
</script>

<div class="mdc-snackbar__label">
  {#if remainingSeconds !== undefined}
    Some async process message. Retrying in {remainingSeconds} seconds.
  {:else}
    Some async process message.
  {/if}
</div>
<div class="mdc-snackbar__actions">
  <button
    class="button mdc-button mdc-snackbar__action"
    on:click={() => {
      notification.pause();
      dialog.show({
        dialogic: {
          component: DialogComponent,
          className: "dialog",
        },
        title: "About this dialog",
        body: "The notification is paused, so you can take your time to read this message.",
        onAccept: () => {
          notification.hide();
          notification.resume();
        },
        onReject: () => {
          notification.resume({ minimumDuration: 2000 });
        },
      });
    }}
  >
    Show options
  </button>
</div>
