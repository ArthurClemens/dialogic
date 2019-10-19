<script>
  import { Notification, notification } from "dialogic-svelte";
  import Default from "./content/Default.svelte";
  import Buttons from "./Buttons.svelte";
  import Remaining from "./Remaining.svelte";
  import { createFns } from "./createFns.ts";

  notification.resetAll();
  const fns = createFns({ instance: notification, component: Default, className: "notification", title: "Default", timeout: 2000 });
  const notificationIsPaused = notification.isPaused();
</script>

<div class="test">
  <div class="control" data-test-id="reset-all">
    <div class="buttons">
      <button class="button" data-test-id="button-pause" on:click={() => notification.pause()}>
        Pause
      </button>
      <button class="button" data-test-id="button-resume" on:click={() => notification.resume()}>
        Resume
      </button>
      <button class="button" data-test-id="button-reset" on:click={() => notification.resetAll()}>
        Reset
      </button>
    </div>
  </div>
  <div class="control" data-test-id="is-paused">
    {`Is paused: ${$notificationIsPaused}`}
  </div>
  <div class="control">
    <Remaining getRemainingFn={notification.getRemaining} />
  </div>
  <div class="content">
    <Buttons {...fns} />
  </div>
  <div class="spawn default-spawn">
    <Notification />
  </div>
</div>
