<script lang="ts">
	import type { Month } from '$lib/models/schedule/Month';
	import FildDateEdit from './FildDateEdit.svelte';

	export let month: Month;
	export let _class: String;
</script>

<div class="bg-white text-dark rounded w-100 overflow-auto {_class}">
	<div class="no-print" style="display: grid; grid-template-columns: .14fr 1fr; min-height: 2.3em">
		<div class="text-center px-3" style="min-width: 8em;">
			<span class="badge bg-dark text-light">Дата</span>
		</div>
		<div style="display: grid; grid-template-columns: 1.31fr .2fr .4fr">
			<div class="ps-5" style="min-width: 13em;">
				<span class="badge bg-dark text-light">Праздник</span>
			</div>
			<div class="text-center" style="min-width: 5em;">
				<span class="badge bg-dark text-light">Время</span>
			</div>
			<div class="ps-4 pe-3" style="min-width: 8em;">
				<span class="badge bg-dark text-light">Богослужение</span>
			</div>
		</div>
	</div>
	<div>
		{#each month.fildsDayAll as item}
			<FildDateEdit fildDate={item} />
		{/each}
	</div>
</div>
