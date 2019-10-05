<div
  class={$$props.className}
  data-test-id={`content-default${$$props.contentId ? `-${$$props.contentId}` : ''}`}
>
  <h2>{$$props.title}</h2>
  <button
    class="button"
    on:click={$$props.hide}
    data-test-id="button-hide-content"
  >
    Hide from component
  </button>
</div>
