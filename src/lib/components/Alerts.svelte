<script lang="ts">
	import { alerts } from '$lib/scripts/writableData';

	setInterval(() => {
		$alerts.splice(0, 1);
		$alerts = $alerts;
	}, 3000);
</script>

<div class="position-fixed w-100 bottom-0">
	<div class="d-flex flex-column align-items-center justify-content-center">
		{#each $alerts as item, i}
			<div class="alert alert-primary w-50 d-flex shadow shadow-sm">
				<div class="flex-grow-1 py-1 px-2 d-flex align-items-center gap-2">
					<i class="fa-solid fa-circle-info" style="font-size:1.2em"></i>
					<div>{item}</div>
				</div>
				<button
					class="btn btn-sm bg-transparent text-primary-emphasis sticky-top"
					on:click={() => {
						$alerts.splice(i, 1);
						$alerts = $alerts;
					}}>
					<i class="fa-solid fa-xmark"></i>
				</button>
			</div>
		{/each}
	</div>
</div>
