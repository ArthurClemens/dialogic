<script>
  import { location } from "svelte-spa-router";
</script>

<div class="control path-control">
  <span class="tag" data-test-id="current-path">{$location}</span>
</div>
