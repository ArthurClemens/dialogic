<script>
  import { Dialog, dialog } from "dialogic-svelte";
  import Default from "./content/Default.svelte";
  import Buttons from "./Buttons.svelte";
  import { createFns } from "./createFns";

  const fns = createFns({ instance: dialog, component: Default, className: "dialog", title: "DialogClassName" });
</script>

<div class="test">
  <Buttons {...fns} />
  <div class="spawn default-spawn">
    <Dialog />
  </div>
</div>
