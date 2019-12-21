<script>
import DemoContent from "./DemoContent.svelte";
import { dialog } from "dialogic-svelte";

export let isModal = false;
// export let show;
// export let hide;
</script>

<div class="modal is-active">
  <div class="modal-background" on:click={() => !isModal && dialog.hide()}></div>
  <div class="modal-content">
    <div class="bulma-dialog-content-box">
      <DemoContent />
    </div>
  </div>
  <button class="modal-close is-large" aria-label="close" on:click={() => dialog.hide()}></button>
</div>

