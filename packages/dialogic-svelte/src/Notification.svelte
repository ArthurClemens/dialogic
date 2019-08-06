<script>
  import { notification } from "./notification";
  import Wrapper from "./Wrapper.svelte";
  import Instance from "./Instance.svelte";

  export let spawn = notification.defaultSpawn;
  export let id = notification.defaultId;

  const spawnOptions = {
    id,
    spawn,
  };

</script>

<Wrapper {Instance} {spawnOptions} ns={notification.ns} />
