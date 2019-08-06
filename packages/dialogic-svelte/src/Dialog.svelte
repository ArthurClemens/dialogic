<script>
  import { dialog } from "./dialog";
  import Wrapper from "./Wrapper.svelte";

  export let spawn = dialog.defaultSpawn;
  export let id = dialog.defaultId;

  const spawnOptions = {
    id,
    spawn,
  };

</script>

<Wrapper {spawnOptions} ns={dialog.ns} />
