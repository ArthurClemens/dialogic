<script lang="ts">
	import { Dialog, Notification } from 'dialogic-svelte-ts';
	import '../dialogic.css';
	import '../layout.css';
</script>

<svelte:head>
	<title>demo-dialogic-sveltekit-router</title>

	<!-- Bulma (Dialog and button styles in this demo) -->
	<link
		rel="stylesheet"
		href="https://use.fontawesome.com/releases/v5.7.2/css/all.css"
		integrity="sha384-fnmOCqbTlWIlj8LyTjo7mOUStjsKC4pOpQbqyi7RrhN7udi9RwhKkMHpvLbHG9Sr"
		crossorigin="anonymous"
	/>
	<link
		rel="stylesheet"
		href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.9.0/css/bulma.min.css"
	/>
</svelte:head>

<div class="app">
	<slot />
</div>

<Notification />
<Dialog />
