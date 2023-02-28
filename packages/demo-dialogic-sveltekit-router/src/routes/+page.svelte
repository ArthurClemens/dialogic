<script lang="ts">
	import CurrentPathBadge from '$lib/CurrentPathBadge.svelte';
</script>

<div data-test-id="home-page">
  <h1 class="title">Home</h1>
  <CurrentPathBadge />
  <p class="intro">
    This demo shows
    <code>UseDialog</code>
    that allows for a declarative way of controlling dialogs. The Profile dialog
    is automatically invoked by the page at the "edit" route, and is
    automatically hidden when using the browser's back button.
  </p>
  <div class="buttons">
    <a class="button is-link" href={'/profile'} data-test-id="btn-profile">
      Go to Profile
    </a>
  </div>
</div>
