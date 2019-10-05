<script>
  import { Dialog, dialog } from "dialogic-svelte";
  import Default from "./content/Default.svelte";
  import Buttons from "./Buttons.svelte";
  import { createFns } from "./createFns";

  const fns1 = createFns({ instance: dialog, component: Default, className: "dialog", title: "Default" });
  const fns2 = createFns({ instance: dialog, component: Default, className: "dialog", id: "1", title: "ID" });
  const fns3 = createFns({ instance: dialog, component: Default, className: "dialog", spawn: "1", title: "Spawn" });
  const fns4 = createFns({ instance: dialog, component: Default, className: "dialog", spawn: "1", id: "1", title: "Spawn and ID" });
  const dialogCount = dialog.getCount();
  const dialogCountId1 = dialog.getCount({ id: "1" });
  const dialogCountSpawn1 = dialog.getCount({ spawn: "1" });
  const dialogCountSpawn1Id1 = dialog.getCount({ spawn: "1", id: "1" });
</script>

<div class="test">
  <div class="control" data-test-id="count-all">{`Count all: ${$dialogCount}`}</div>
  <div class="control" data-test-id="count-id">{`Count id: ${$dialogCountId1}`}</div>
  <div class="control" data-test-id="count-spawn">{`Count spawn: ${$dialogCountSpawn1}`}</div>
  <div class="control" data-test-id="count-spawn-id">{`Count spawn, id: ${$dialogCountSpawn1Id1}`}</div>
  <div class="control" data-test-id="hide-all">
    <div class="buttons">
      <button class="button" data-test-id="button-hide-all" on:click={() => dialog.hideAll()}>
        Hide all
      </button>
      <button class="button" data-test-id="button-hide-all-id" on:click={() => dialog.hideAll({ id: "1" })}>
        Hide all with id
      </button>
      <button class="button" data-test-id="button-hide-all-spawn" on:click={() => dialog.hideAll({ spawn: "1" })}>
        Hide all with spawn
      </button>
      <button class="button" data-test-id="button-hide-all-spawn-id" on:click={() => dialog.hideAll({ id: "1", spawn: "1" })}>
        Hide all with spawn and id
      </button>
    </div>
  </div>
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
