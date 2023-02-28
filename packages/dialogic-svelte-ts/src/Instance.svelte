<script lang="ts">
  import type { ComponentType } from 'svelte';

  import type { Dialogic } from "dialogic";

  import { onMount, createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  // DOM bindings
  let domElement: HTMLElement;

  export let identityOptions: Dialogic.IdentityOptions;
  export let passThroughOptions: Record<string, unknown>;
  export let dialogicOptions: Omit<Dialogic.DialogicOptions, 'component'> & {
    component: ComponentType
  };

  const className = dialogicOptions ? dialogicOptions.className : "";

  const dispatchTransition = (name: string) =>
    dispatch(name, {
      identityOptions,
      domElement,
    });

  const show = () => {
    dispatchTransition("show");
  };

  const hide = () => {
    dispatchTransition("hide");
  };

  onMount(() => {
    dispatchTransition("mount");
  });
</script>

<div class={className} bind:this={domElement}>
  <svelte:component
    this={dialogicOptions.component}
    {show}
    {hide}
    {...passThroughOptions}
  />
</div>
