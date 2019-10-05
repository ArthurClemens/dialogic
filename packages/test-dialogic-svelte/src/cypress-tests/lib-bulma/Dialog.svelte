<script>
import { Dialog, dialog } from "dialogic-svelte";
import DialogComponent from "./DialogComponent.svelte";
</script>

<div class="test">
  <div class="control" data-test-id="hide-all">
    <div class="buttons">
      <button
        class="button"
        on:click={() => dialog.show({
          dialogic: {
            component: DialogComponent,
            className: "dialog",
          }
        })}
      >
        Show dialog
      </button>
      <button
        class="button"
        on:click={() => dialog.show({
          dialogic: {
            component: DialogComponent,
            className: "dialog",
          },
          isModal: true,
        })}
      >
        Show modal dialog
      </button>
    </div>
  </div>
  <div class="bulma">
    <Dialog />
  </div>
</div> 
