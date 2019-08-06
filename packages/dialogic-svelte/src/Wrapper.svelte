
<script>
  import { appState } from "./store";
  import { filter } from "dialogic";
  import { onInstanceMounted, onShowInstance, onHideInstance } from "./instance-events";
  import Instance from "./Instance.svelte";

  export let spawnOptions;
  export let ns;

  const nsOnInstanceMounted = onInstanceMounted(ns);
  const nsOnShowInstance = onShowInstance(ns);
  const nsOnHideInstance = onHideInstance(ns);
  
</script>

{#each filter($appState.store, spawnOptions.spawn, ns) as { spawnOptions, transitionOptions, instanceOptions, key }, index(key)}
  <Instance
    {spawnOptions}
    {transitionOptions}
    {instanceOptions}
    on:mount={nsOnInstanceMounted}
    on:show={nsOnShowInstance}
    on:hide={nsOnHideInstance}
  />
{/each}
