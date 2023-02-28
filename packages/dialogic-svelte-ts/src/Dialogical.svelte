<script lang="ts">
  import type { ComponentType } from 'svelte';

  import type { Dialogic } from "dialogic";

  import { onMount as svelteOnMount } from "svelte";
  import Wrapper from "./Wrapper.svelte";

  let component: ComponentType = Wrapper;

  export let instance: Dialogic.DialogicInstance;
  export let ns: string = instance.ns;
  export let spawn: string | undefined = undefined;
  export let id: string | undefined = undefined;
  export let onMount: ((args?: unknown) => unknown) | undefined = undefined;

  const identityOptions = {
    id: id || instance.defaultId,
    spawn: spawn || instance.defaultSpawn,
  };

  svelteOnMount(() => {
    if (typeof onMount === "function") {
      onMount();
    }
  });
</script>

<svelte:component this={component} {identityOptions} {ns} />
