<script>
	import { onDestroy } from "svelte";

	export let getRemaining;
	
	let displayValue = 0;
	let reqId;
	
  const update = () => {
    const value = getRemaining();
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

<div data-test-id="remaining">
  <span data-test-id="remaining-value">{displayValue === undefined
    ? "undefined"
    : displayValue.toString()}</span>
</div>
