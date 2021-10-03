<script>
  /**
   * This example uses Material IO
   */

  import NotificationContent from "./NotificationContent.svelte";
</script>

<div class="mdc-snackbar mdc-snackbar--open">
  <div class="mdc-snackbar__surface">
    <NotificationContent {$$props} />
  </div>
</div>
