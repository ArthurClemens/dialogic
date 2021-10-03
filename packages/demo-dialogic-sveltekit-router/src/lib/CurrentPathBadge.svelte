<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="control path-control">
	<span class="tag" data-test-id="current-path">{$page.path}</span>
</div>
