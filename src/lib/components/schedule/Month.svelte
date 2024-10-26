<script lang="ts">
	import FildDate from '$lib/components/schedule/FildDate.svelte';
	import type { Month } from '$lib/models/schedule/Month';

	export let month: Month;
	export let _class='';
</script>

{#if month.fildsDayNotEmpty != null}
	<div class="rounded bg-white text-dark w-100 overflow-auto {_class}">
		<div>
			<div class="py-2 ps-4 print-title d-none">
				<b>Расписание на {month.monthName()?.toUpperCase()} {month.year} года</b>
			</div>
			<div class="no-print" style="display: grid; grid-template-columns: .12fr 1fr; min-height: 2.3em">
				<div class="text-center px-3" style="min-width: 8.2em;">
					<span class="badge bg-dark text-light">Дата</span>
				</div>
				<div style="display: grid; grid-template-columns: 1fr .4fr .1fr">
					<div class="ps-3" style="min-width: 13em;">
						<span class="badge bg-dark text-light">Праздник</span>
					</div>
					<div class="text-end pe-3" style="min-width: 8em;">
						<span class="badge bg-dark text-light">Богослужение</span>
					</div>
					<div class="text-center" style="min-width: 5em;">
						<span class="badge bg-dark text-light">Время</span>
					</div>
				</div>
			</div>
		</div>
		<div>
			{#each month.fildsDayNotEmpty as item}
				<FildDate fildDate={item} />
			{/each}
		</div>
	</div>
{/if}
