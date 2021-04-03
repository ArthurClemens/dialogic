<script>
  import { onMount } from 'svelte';
  let useDialogicCounter = 0;
  const useEffect = subscribe => ({ subscribe });

  const id = useDialogicCounter++;

  export let props;
  export let isShow = undefined;
  export let isHide = undefined;
  export let isIgnore = undefined;
  export let deps;
  export let instance;

  // Make augProps reactive
  $: augProps = {
    ...props,
    ...(props.dialogic
      ? {
          dialogic: {
            ...props.dialogic,
            id: props.dialogic.id || id,
          },
        }
      : {
          dialogic: {
            id,
          },
        }),
  };

  const showInstance = () => {
    instance.show(augProps);
  };

  const hideInstance = () => {
    instance.hide(augProps);
  };

  let effect;
  $: effect = useEffect(() => {
    let _deps = deps; // consume variable for reactivity
    if (!isIgnore) {
      if (isShow !== undefined) {
        if (isShow) {
          showInstance();
        } else {
          hideInstance();
        }
      } else if (isHide !== undefined) {
        if (isHide) {
          hideInstance();
        }
      }
    }

    return () => {
      // required
    };
  });

  $: $effect;

  onMount(() => {
    return () => {
      hideInstance();
    };
  });
</script>
