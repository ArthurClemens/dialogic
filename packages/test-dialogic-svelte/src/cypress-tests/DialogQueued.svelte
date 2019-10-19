<script>
  import { Dialog, dialog } from "dialogic-svelte";
  import Default from "./content/Default.svelte";
  import Buttons from "./Buttons.svelte";
  import { createFns } from "./createFns.ts";

  dialog.resetAll()
  const fns = createFns({ instance: dialog, component: Default, className: "dialog", title: "Default", queued: true });
  const dialogCount = dialog.getCount();
</script>

<div class="test">
  <div class="control" data-test-id="count-all">{`Count all: ${$dialogCount}`}</div>
  <div class="content">
    <Buttons {...fns} />
  </div>
  <div class="spawn default-spawn">
    <Dialog />
  </div>
</div>
