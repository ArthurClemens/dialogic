<!-- <script context="module">
  import { notification } from "./notification";
  export { notification };
</script> -->

<script>
  import { notification } from "./notification";
  import Dialogic from "./Dialogic.svelte";
  import Instance from "./Instance.svelte";

  export let spawn = notification.defaultSpawn;
  export let id = notification.defaultId;

  const spawnOptions = {
    id,
    spawn,
  };

</script>

<Dialogic {Instance} {spawnOptions} ns={notification.ns} />
