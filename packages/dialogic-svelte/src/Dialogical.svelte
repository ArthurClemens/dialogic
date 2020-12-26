<script>
  import { onMount as svelteOnMount } from 'svelte';
  import Wrapper from './Wrapper.svelte';

  export let instance;
  export let ns = instance.ns;
  export let spawn = undefined;
  export let id = undefined;
  export let onMount = undefined;

  const identityOptions = {
    id: id || instance.defaultId,
    spawn: spawn || instance.defaultSpawn,
  };

  svelteOnMount(() => {
    if (typeof onMount === 'function') {
      onMount();
    }
  });
</script>

<Wrapper {identityOptions} {ns} />
