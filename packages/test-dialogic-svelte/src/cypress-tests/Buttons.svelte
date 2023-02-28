<script>
  export let showFn;
  export let hideFn;
  export let id = '';
  export let spawn = '';
  export let name = '';

  const genName =
    name ||
    `${id ? `id${id}` : ''}${spawn ? `spawn${spawn}` : ''}` ||
    'default';
</script>

<div class="buttons">
  {#if showFn}
    <button
      class="button primary"
      on:click={showFn}
      data-test-id={`button-show-${genName}`}
    >
      {`Show ${genName}`}
    </button>
  {/if}
  {#if hideFn}
    <button
      class="button"
      on:click={hideFn}
      data-test-id={`button-hide-${genName}`}
    >
      {`Hide ${genName}`}
    </button>
  {/if}
</div>
