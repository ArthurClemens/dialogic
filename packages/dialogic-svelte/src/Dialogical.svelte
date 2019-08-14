<script>
  import { onMount as svelteOnMount } from "svelte";
  import Wrapper from "./Wrapper.svelte";

  export let type;
  export let ns = type.ns;
  export let spawn = undefined;
  export let id = undefined;
  export let onMount = undefined;

  const identityOptions = {
    id: id || type.defaultId,
    spawn: spawn || type.defaultSpawn,
  };

  svelteOnMount(() => {
    if (typeof onMount === "function") {
      onMount();
    }
  })
</script>

<Wrapper {identityOptions} {ns} />
