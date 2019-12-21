<script>
  import { dialog, notification } from "dialogic-svelte";
  import DialogComponent from "./DialogComponent.svelte";
</script>

<div class="mdc-snackbar__label">
  Can't send photo. Retry in 5 seconds.
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
