<script>
	import { onInterval } from './utils.js';

	let seconds = 0;
	onInterval(() => seconds += 1, 1000);
</script>

<div>
  <h2>{$$props.title}</h2>
  The page has been open for
	{seconds} {seconds === 1 ? 'second' : 'seconds'}
  <button on:click={$$props.hide}>hide from instance</button>
</div>
