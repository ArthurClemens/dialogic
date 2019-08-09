<script>
	import { onDestroy } from "svelte";

	export let getRemainingFn;
	
	let displayValue = 0;
	let reqId;
	
  const update = () => {
    const value = getRemainingFn();
    displayValue = value === undefined
      ? undefined
      : Math.max(value, 0);
    reqId = window.requestAnimationFrame(update);
  };
	reqId = window.requestAnimationFrame(update);
	
	onDestroy(() => {
		window.cancelAnimationFrame(reqId);
	});
</script>

<div>
  Remaining: {displayValue}
</div>
