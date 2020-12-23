<script lang="ts" context="module">
  import { Dialog, Notification } from 'dialogic-svelte';
</script>

<main class="app">
  <slot />
  <Dialog />
  <Notification />
</main>
