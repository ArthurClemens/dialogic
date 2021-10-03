<script>
  import { dialog } from "../../dialogic-svelte";
</script>

<div class="mdc-dialog__container">
  <div class="mdc-dialog__surface">
    <div>
      <h2 class="h2 mdc-dialog__title">
        {$$props.title}
      </h2>
      <div class="mdc-dialog__content">
        {$$props.body}
      </div>
      <footer class="mdc-dialog__actions">
        <div>
          <button
            class="mdc-button mdc-dialog__button"
            on:click={() => {
              dialog.hide();
              $$props.onReject();
            }}
          >
            <span class="mdc-button__label">Resume</span>
          </button>
          <button
            class="mdc-button mdc-dialog__button"
            on:click={() => {
              dialog.hide();
              $$props.onAccept();
            }}
          >
            <span class="mdc-button__label">Hide all</span>
          </button>
        </div>
      </footer>
    </div>
  </div>
</div>
