<script lang="ts">
  import type { ComponentType } from 'svelte';

  import { notification } from "./notification";
  import Dialogical from "./Dialogical.svelte";

  let component: ComponentType = Dialogical;
</script>

<svelte:component this={component} {...$$props} instance={notification} />
