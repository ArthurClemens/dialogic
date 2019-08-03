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
  export let showClass = "xxx--visible";
  
  $: R_classNames = [
    "xxx",
    className
	].join(" ");

  const dispatchTransition = name =>
    dispatch(name, {
      spawnOptions,
      transitionOptions: {
        showClass,
        domElements: {
          domElement
        }
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

<style>
  :global(.xxx) {
    background-color: #f0f0f0;
    padding: 10px;
    opacity: 0;
    border: 5px solid #fff;
    transition-property: opacity, background-color, transform;
    transition-duration: 220ms;
    transition-delay: 0ms;
    transition-timing-function: ease-in-out;
  }
  :global(.xxx--visible) {
    opacity: 1;
  }
</style>

<div 
  class={R_classNames}
  bind:this={domElement}
  {...elementProps}
>
  Notification
  {title}
  <button on:click={hide}>hide from instance</button>
</div>

