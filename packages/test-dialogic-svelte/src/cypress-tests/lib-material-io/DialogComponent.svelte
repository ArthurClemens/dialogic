<script>
import DemoContent from "./DemoContent.svelte";
import { dialog } from "dialogic-svelte";

export let isModal = false;
export let show;
export let hide;
</script>

<div
  class="mdc-dialog mdc-dialog--open"
  role="alertdialog"
  aria-modal="true"
  aria-labelledby="my-dialog-title"
  aria-describedby="my-dialog-content"
  >
    <DemoContent />
    <div
      class="mdc-dialog__scrim"
      on:click={() => !isModal && dialog.hide()}
    />
</div>
