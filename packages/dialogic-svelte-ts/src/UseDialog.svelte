<script lang="ts">
  import { dialog } from "dialogic";
  import UseDialogic from "./UseDialogic.svelte";
</script>

<UseDialogic {...$$props} instance={dialog} />
