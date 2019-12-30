<script>
  import { remaining } from "dialogic";

  export let instance;
  export let roundToSeconds;
  let remainingSeconds;

  remaining({
    instance,
    roundToSeconds: roundToSeconds,
    callback: (newValue) => {
      remainingSeconds = newValue;
    },
  });
  
</script>

<div class="remaining">
  <span>
    {remainingSeconds === undefined
      ? "0"
      : remainingSeconds.toString()
    }
  </span>
</div>

<style>
.remaining {
  min-width: 3em;
  text-align: left;
}
</style>
