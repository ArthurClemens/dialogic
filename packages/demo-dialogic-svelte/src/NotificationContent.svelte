<script>
  import { dialog, notification } from "dialogic-svelte";
  import DialogComponent from "./DialogComponent.svelte";
  import { remaining } from "dialogic";

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
    Can't send photo. Retry in {remainingSeconds} seconds.
  {:else}
    Can't send photo.
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
        title: "Retry sending?",
        body: "We have noticed a slow internet connection. Sending may take a bit longer than usual.",
        onAccept: () => {
          notification.hide();
          notification.resume();
        },
        onReject: () => {
          notification.resume({ minimumDuration: 2000 });
        }
      });
    }}>
    Retry
  </button>
</div>
