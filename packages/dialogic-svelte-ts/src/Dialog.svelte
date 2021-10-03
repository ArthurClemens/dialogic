<script lang="ts">
  import { dialog } from "./dialog";
  import Dialogical from "./Dialogical.svelte";
</script>

<Dialogical {...$$props} instance={dialog} />
