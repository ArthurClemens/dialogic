<script context="module">
  import { notification } from "./notification";
  export { notification };
</script>

<script>
  import NotificationInstance from "./NotificationInstance.svelte";
  import Dialogic from "../dialogic/Dialogic.svelte";

  export let spawn = notification.defaultSpawn;
  export let id = notification.defaultId;

  const notificationSpawnOptions = {
    id,
    spawn,
  };

</script>

<Dialogic Instance={NotificationInstance} spawnOptions={notificationSpawnOptions} ns={notification.ns} />
