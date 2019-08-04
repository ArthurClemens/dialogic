<script>
  import { dialog } from "./dialog";
  import Dialogic from "./Dialogic.svelte";
  import Instance from "./Instance.svelte";

  export let spawn = dialog.defaultSpawn;
  export let id = dialog.defaultId;

  const spawnOptions = {
    id,
    spawn,
  };

</script>

<Dialogic {Instance} {spawnOptions} ns={dialog.ns} />
