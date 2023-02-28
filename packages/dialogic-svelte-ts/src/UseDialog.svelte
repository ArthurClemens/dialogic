<script lang="ts">
  import type { ComponentType } from 'svelte';

  import { dialog } from "dialogic";
  import UseDialogic from "./UseDialogic.svelte";

  let component: ComponentType = UseDialogic;
</script>

<svelte:component this={component} {...$$props} instance={dialog} />
