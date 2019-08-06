<script>
  import { onMount, createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  // DOM bindings
  let domElement;

  export let spawnOptions = undefined;
  export let instanceOptions = undefined;
  export let transitionOptions = undefined;

  $: R_classNames = [,
    transitionOptions.className,
    instanceOptions.className
	].join(" ");

  const dispatchTransition = (name) =>
    dispatch(name, {
      spawnOptions,
      transitionOptions: {
        className: transitionOptions.className,
        showClassName: transitionOptions.showClassName,
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
  <svelte:component this={transitionOptions.component} {show} {hide} {...instanceOptions} />
</div>

