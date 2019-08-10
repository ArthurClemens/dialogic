<script>
  import { notification } from "./notification";
  import Dialogical from "./Dialogical.svelte";

  export let spawn = undefined;
  export let id = undefined;
  export let onMount = undefined;
</script>

<Dialogical {spawn} {id} type={notification} {onMount} />
