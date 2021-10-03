<script>
  import { Dialog, Notification } from "dialogic-svelte";

  import Router from "svelte-spa-router"; // https://github.com/ItalyPaleAle/svelte-spa-router
  import routes from "./routes";
</script>

<div class="app">
  <Router {routes} />
  <Notification />
  <Dialog />
</div>
