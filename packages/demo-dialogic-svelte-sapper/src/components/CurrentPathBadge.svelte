<script>
  import { stores } from '@sapper/app';
  const { page } = stores();
</script>

<div class="control path-control">
  <span class="tag" data-test-id="current-path">{$page.path}</span>
</div>
