
<script>
  import { appState } from "./store";
  import { filterCandidates } from "dialogic";
  import { onInstanceMounted, onShowInstance, onHideInstance } from "./dialogic-svelte";
  import { onDestroy } from "svelte";

  export let spawnOptions;
  export let Instance;
  export let ns;

  const nsOnInstanceMounted = onInstanceMounted(ns);
  const nsOnShowInstance = onShowInstance(ns);
  const nsOnHideInstance = onHideInstance(ns);
  
</script>

{#each filterCandidates(ns, $appState.store, spawnOptions.spawn) as { spawnOptions, instanceOptions, key }, index(key)}
  <Instance
    {...instanceOptions}
    {spawnOptions}
    on:mount={nsOnInstanceMounted}
    on:show={nsOnShowInstance}
    on:hide={nsOnHideInstance}
  />
{/each}
