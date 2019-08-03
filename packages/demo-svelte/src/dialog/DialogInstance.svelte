<script>
  import { onMount, createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  // DOM bindings
  let domElement;

  export let id = undefined;
  export let title = "";
  export let spawnOptions = undefined;
  export let instanceOptions = undefined;
  export let className = "";
  export let showClass = "pe-dialog--visible";
  
  $: R_classNames = [
    "pe-dialog",
    className
	].join(" ");

  const dispatchTransition = (name, hideDelay) =>
    dispatch(name, {
      spawnOptions,
      transitionOptions: {
        showClass,
        domElements: {
          domElement
        },
      },
    });

  const show = e => {
    dispatchTransition("show");
  };

  const hide = e => {
    dispatchTransition("hide");
  };

  onMount(() => {
    dispatchTransition("mount");
  });

  $: elementProps = {
    class: R_classNames,
  };
</script>

<div 
  class={R_classNames}
  bind:this={domElement}
  {...elementProps}
>
  Dialog
  {title}
  <button on:click={hide}>hide from instance</button>
</div>

