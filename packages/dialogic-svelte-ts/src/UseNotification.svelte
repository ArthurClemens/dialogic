<script lang="ts">
  import type { ComponentType } from 'svelte';

  import { notification } from "dialogic";
  import UseDialogic from "./UseDialogic.svelte";

  let component: ComponentType = UseDialogic;
</script>

<svelte:component this={component} instance={notification} {...$$props} />
