<script lang="ts" context="module">
  import { Dialog, Notification } from 'dialogic-svelte';
</script>

<script lang="ts">
  import Nav from '../components/Nav.svelte';

  export let segment: string;
</script>

<style>
  main {
    position: relative;
    max-width: 56em;
    background-color: white;
    padding: 2em;
    margin: 0 auto;
    box-sizing: border-box;
  }
  :global(.dialog) {
    transition: opacity 350ms;
    opacity: 0;
  }
  :global(.dialog-show-end) {
    opacity: 1;
  }
  :global(.dialog-hide-end) {
    opacity: 0;
  }

  /* Cannot use `.notification` as it is used by Bulma */
  :global(.demo-notification) {
    position: fixed;
    z-index: 30;
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: flex-end;
    justify-content: center;
  }

  :global(.notification-content) {
    position: relative;
    z-index: 0;
    padding: 16px 24px;
    color: #fff;
    background: #333;
    width: 100%;
    margin: 0 20px;
    border-radius: 8px 8px 0 0;
  }
</style>

<Nav {segment} />

<main>
  <slot />
  <Dialog />
  <Notification />
</main>
