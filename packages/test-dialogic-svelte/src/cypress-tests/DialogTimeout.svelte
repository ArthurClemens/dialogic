<script>
  import { Dialog, dialog } from "dialogic-svelte";
  import Default from "./content/Default.svelte";
  import Buttons from "./Buttons.svelte";
  import Remaining from "./Remaining.svelte";
  import { createFns } from "./createFns";

  dialog.resetAll();
  const fns = createFns({ instance: dialog, component: Default, className: "dialog", title: "Default", timeout: 2000 });
  const dialogIsPaused = dialog.isPaused();
</script>

<div class="test">
  <div class="control" data-test-id="reset-all">
    <div class="buttons">
      <button class="button" data-test-id="button-pause" on:click={() => dialog.pause()}>
        Pause
      </button>
      <button class="button" data-test-id="button-resume" on:click={() => dialog.resume()}>
        Resume
      </button>
      <button class="button" data-test-id="button-reset" on:click={() => dialog.resetAll()}>
        Reset
      </button>
    </div>
  </div>
  <div class="control" data-test-id="is-paused">
    {`Is paused: ${$dialogIsPaused}`}
  </div>
  <div class="control">
    <Remaining getRemainingFn={dialog.getRemaining} />
  </div>
  <div class="content">
    <Buttons {...fns} />
  </div>
  <div class="spawn default-spawn">
    <Dialog />
  </div>
</div>
