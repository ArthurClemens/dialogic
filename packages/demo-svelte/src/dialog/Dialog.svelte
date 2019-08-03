<script context="module">
  import { dialog } from "./dialog";
  export { dialog };
</script>

<script>
  import DialogInstance from "./DialogInstance.svelte";
  import Dialogic from "../dialogic/Dialogic.svelte";

  export let spawn = dialog.defaultSpawn;
  export let id = dialog.defaultId;

  const dialogSpawnOptions = {
    id,
    spawn,
  };

</script>

<Dialogic Instance={DialogInstance} spawnOptions={dialogSpawnOptions} ns={dialog.ns} />
