
<script>
  import { appState } from "./store";
  import { filterCandidates } from "dialogic";
  import { onInstanceMounted, onShowInstance, onHideInstance } from "./instanceEvents";
  import Instance from "./Instance.svelte";

  export let spawnOptions;
  export let ns;

  const nsOnInstanceMounted = onInstanceMounted(ns);
  const nsOnShowInstance = onShowInstance(ns);
  const nsOnHideInstance = onHideInstance(ns);
  
</script>

{#each filterCandidates(ns, $appState.store, spawnOptions) as { spawnOptions, transitionOptions, passThroughOptions, key }, index(key)}
  <Instance
    {spawnOptions}
    {transitionOptions}
    {passThroughOptions}
    on:mount={nsOnInstanceMounted}
    on:show={nsOnShowInstance}
    on:hide={nsOnHideInstance}
  />
{/each}
