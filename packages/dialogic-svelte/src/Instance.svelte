<script>
  import { onMount, createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  // DOM bindings
  let domElement;

  export let spawnOptions = undefined;
  export let instanceOptions = undefined;
  export let transitionOptions = undefined;

  const className = transitionOptions.transitionClassName;

  const dispatchTransition = (name) =>
    dispatch(name, {
      spawnOptions, // for identification
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
  <svelte:component this={transitionOptions.component} {show} {hide} {...instanceOptions} />
</div>

