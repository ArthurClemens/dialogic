<script>
  import { onMount, createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  // DOM bindings
  let domElement;

  export let component = undefined;
  export let spawnOptions = undefined;
  export let instanceOptions = undefined;
  export let className = undefined;
  export let showClassName = undefined;

  $: R_classNames = [
    className
	].join(" ");

  const dispatchTransition = (name) =>
    dispatch(name, {
      spawnOptions,
      transitionOptions: {
        showClassName,
        domElements: {
          domElement
        },
      },
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

  $: elementProps = {
    class: R_classNames,
  };
</script>

<div 
  class={R_classNames}
  bind:this={domElement}
  {...elementProps}
>
  <svelte:component this={component} hide={hide} {...instanceOptions} />
</div>

