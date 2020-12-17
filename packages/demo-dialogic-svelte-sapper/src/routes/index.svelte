<script>
  import successkid from 'images/successkid.jpg';
  import { dialog } from 'dialogic-svelte';
  // import DialogComponent from '../components/DialogComponent.svelte';
</script>

<style>
  h1,
  figure,
  p {
    text-align: center;
    margin: 0 auto;
  }

  h1 {
    font-size: 2.8em;
    text-transform: uppercase;
    font-weight: 700;
    margin: 0 0 0.5em 0;
  }

  figure {
    margin: 0 0 1em 0;
  }

  img {
    width: 100%;
    max-width: 400px;
    margin: 0 0 1em 0;
  }

  p {
    margin: 1em auto;
  }

  @media (min-width: 480px) {
    h1 {
      font-size: 4em;
    }
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
</style>

<svelte:head>
  <title>Sapper project template</title>
</svelte:head>

<h1>Great success!</h1>

<figure>
  <img alt="Success Kid" src={successkid} />
  <figcaption>Have fun with Sapper!</figcaption>
</figure>

<p>
  <strong>Try editing this file (src/routes/index.svelte) to test live
    reloading.</strong>
</p>

<!-- <button
  class="button mdc-button mdc-snackbar__action"
  on:click={() => {
    dialog.show({
      dialogic: {
        component: DialogComponent,
        className: 'dialog',
      },
      title: 'Retry sending?',
      body:
        'We have noticed a slow internet connection. Even when you retry now, sending may take longer than usual.',
      onAccept: () => {
        // notification.hide();
        // notification.resume();
      },
      onReject: () => {
        // notification.resume({ minimumDuration: 2000 });
      },
    });
  }}>
  Retry now
</button> -->
