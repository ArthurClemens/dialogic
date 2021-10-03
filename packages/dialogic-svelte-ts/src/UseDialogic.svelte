<script lang="ts">
  import type { Dialogic } from "dialogic";
  import { onMount } from "svelte";

  let useDialogicCounter = 0;
  const useEffect = (subscribe: unknown) =>
    ({ subscribe } as SvelteStore<unknown>);

  const id = useDialogicCounter++;

  export let props: Partial<Dialogic.Options> | undefined = undefined;
  export let instance: Dialogic.DialogicInstance;
  export let isShow: boolean | undefined = undefined;
  export let isHide: boolean | undefined = undefined;
  export let isIgnore: boolean | undefined = undefined;
  export let deps: unknown[] | undefined = undefined;

  // Make augProps reactive
  $: augProps = {
    ...props,
    ...(props?.dialogic
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
  } as Dialogic.Options;

  const showInstance = () => {
    instance.show(augProps);
  };

  const hideInstance = () => {
    instance.hide(augProps);
  };

  let effect: SvelteStore<unknown>;
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
