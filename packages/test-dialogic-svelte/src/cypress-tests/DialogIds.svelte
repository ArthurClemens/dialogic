<script>
  import { Dialog, dialog } from "dialogic-svelte";
  import Default from "./content/Default.svelte";
  import Buttons from "./Buttons.svelte";
  import { createFns } from "./createFns.ts";

  dialog.resetAll();
  const fns1 = createFns({ instance: dialog, component: Default, className: "dialog", title: "DialogIds default" });
  const fns2 = createFns({ instance: dialog, component: Default, className: "dialog", id: "1", title: "DialogIds 1" });
  const fns3 = createFns({ instance: dialog, component: Default, className: "dialog", id: "2", title: "DialogIds 2" });
</script>

<div class="test">
  <Buttons {...fns1} />
  <Buttons {...fns2} id="1" />
  <Buttons {...fns3} id="2" />
  <div class="spawn default-spawn">
    <Dialog />
  </div>
</div>
