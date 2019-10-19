<script>
  import { Dialog, dialog } from "dialogic-svelte";
  import Default from "./content/Default.svelte";
  import Buttons from "./Buttons.svelte";
  import { createFns } from "./createFns.ts";

  const fns1 = createFns({ instance: dialog, component: Default, className: "dialog", title: "Default" });
  const fns2 = createFns({ instance: dialog, component: Default, className: "dialog", id: "1", title: "ID" });
  const fns3 = createFns({ instance: dialog, component: Default, className: "dialog", spawn: "1", title: "Spawn" });
  const fns4 = createFns({ instance: dialog, component: Default, className: "dialog", spawn: "1", id: "1", title: "Spawn and ID" });
  const dialogExists = dialog.exists();
  const dialogExistsId1 = dialog.exists({ id: "1" });
  const dialogExistsSpawn1 = dialog.exists({ spawn: "1" });
  const dialogExistsSpawn1Id1 = dialog.exists({ spawn: "1", id: "1" });
</script>

<div class="test">
  <div class="control" data-test-id="count-all">{`Exists any: ${$dialogExists}`}</div>
  <div class="control" data-test-id="count-id">{`Exists id: ${$dialogExistsId1}`}</div>
  <div class="control" data-test-id="count-spawn">{`Exists spawn: ${$dialogExistsSpawn1}`}</div>
  <div class="control" data-test-id="count-spawn-id">{`Exists spawn, id: ${$dialogExistsSpawn1Id1}`}</div>
  <div class="content">
    <Buttons {...fns1} />
    <Buttons {...fns2} id="1" />
    <Buttons {...fns3} spawn="1" />
    <Buttons {...fns4} spawn="1" id="1" />
  </div>
  <div class="spawn default-spawn">
    <Dialog />
  </div>
  <div class="spawn custom-spawn">
    <Dialog spawn="1" />
  </div>
</div>
