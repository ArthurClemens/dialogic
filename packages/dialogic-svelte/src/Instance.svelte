<script>
  import { onMount, createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  // DOM bindings
  let domElement;

  export let identityOptions;
  export let passThroughOptions;
  export let dialogicOptions;

  const className = dialogicOptions ? dialogicOptions.className : '';

  const dispatchTransition = (name) =>
    dispatch(name, {
      identityOptions,
      domElement
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

<div 
  class={className}
  bind:this={domElement}
>
  <svelte:component this={dialogicOptions.component} {show} {hide} {...passThroughOptions} />
</div>

