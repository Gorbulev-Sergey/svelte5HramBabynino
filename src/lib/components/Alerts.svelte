<script lang="ts">
	import { SETTINGS } from '$lib/settings/settings.svelte';

	$effect(() => {
		const interval = setInterval(() => {
			SETTINGS.alerts.splice(0, 1);
		}, 3000);
		return () => {
			clearInterval(interval);
		};
	});
</script>

<div class="position-fixed w-100 bottom-0">
	<div class="d-flex flex-column align-items-center justify-content-center">
		{#each SETTINGS.alerts as item, i}
			<div class="alert alert-primary w-50 d-flex shadow shadow-sm">
				<div class="flex-grow-1 py-1 px-2 d-flex align-items-center gap-2">
					<i class="fa-solid fa-circle-info" style="font-size:1.2em"></i>
					<div>{item}</div>
				</div>
				<button
					aria-label=""
					class="btn btn-sm bg-transparent text-primary-emphasis sticky-top"
					onclick={() => {
						SETTINGS.alerts.splice(i, 1);
					}}>
					<i class="fa-solid fa-xmark"></i>
				</button>
			</div>
		{/each}
	</div>
</div>
