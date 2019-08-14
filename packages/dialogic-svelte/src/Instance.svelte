<script>
  import { onMount, createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  // DOM bindings
  let domElement;

  export let identityOptions = undefined;
  export let passThroughOptions = undefined;
  export let dialogicOptions = undefined;

  const className = dialogicOptions.className;

  const dispatchTransition = (name) =>
    dispatch(name, {
      identityOptions, // for identification
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

