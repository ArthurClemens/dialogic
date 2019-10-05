<script>
import { dialog } from "dialogic-svelte";
</script>

<div class="mdc-dialog__container">
  <div class="mdc-dialog__surface">
    <h2 class="mdc-dialog__title" id="my-dialog-title">Dialog Title</h2>
    <div class="mdc-dialog__content" id="my-dialog-content">
      Dialog body text goes here.
    </div>
    <footer class="mdc-dialog__actions">
      <button
        type="button"
        class="mdc-button mdc-dialog__button"
        data-mdc-dialog-action="no"
        on:click={() => dialog.hide()}
      >
        <span class="mdc-button__label">No</span>
      </button>
      <button
        type="button"
        class="mdc-button mdc-dialog__button"
        data-mdc-dialog-action="yes"
        on:click={() => dialog.hide()}
      >
        <span class="mdc-button__label">Yes</span>
      </button>
    </footer>
  </div>
</div>
