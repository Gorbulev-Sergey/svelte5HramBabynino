<script>
	import { browser } from '$app/environment';
	import Large from './Breakpoint/Large.svelte';
	import Small from './Breakpoint/Small.svelte';
</script>

{#if browser}
	<Large>
		<div class="bg-white rounded-3 m-0 p-4">
			<slot />
		</div>
	</Large>
	<Small>
		<div class="bg-white p-3" style="margin:0 -1em">
			<slot />
		</div>
	</Small>
{/if}
