<script>
  import DialogContent from "./DialogContent.svelte";
</script>

<div
  class="mdc-dialog mdc-dialog--open"
  role="alertdialog"
  aria-modal="true"
  aria-labelledby="my-dialog-title"
  aria-describedby="my-dialog-content"
  >
    <DialogContent {...$$props} />
    <div class="mdc-dialog__scrim"/> <!-- modal, onclick is not used -->
</div>
