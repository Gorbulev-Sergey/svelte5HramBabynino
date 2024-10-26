<script>
	import Month from '$lib/components/schedule/Month.svelte';
	import { onMount } from 'svelte';
	import { Month as _Month } from '$lib/models/schedule/Month';
	import PageTitleWrap from '$lib/components/PageTitleWrap.svelte';
	import { goto } from '$app/navigation';
	import { scheduleMonth as month } from '$lib/scripts/writableData';

	let m = '';

	onMount(async () => {
		m = `${$month.year}-${$month.month < 10 ? '0' + $month.month : $month.month}`;
		getSchedule();
	});

	async function getSchedule() {
		let response = await fetch('/api/schedule', {
			method: 'POST',
			body: JSON.stringify({
				month: {
					year: $month.year,
					name: $month.monthName()
				}
			})
		});
		let schedule = await response.json();
		$month.fildsDayNotEmpty = schedule;
		$month.updateFildsDayAll();
	}
</script>

<PageTitleWrap title={`Расписание богослужений на`}>
	<div slot="center" class="input-group me-3">
		<span class="input-group-text bg-dark text-light border-0">Дата:</span>
		<input
			class="form-control bg-light text-dark border-0"
			type="month"
			bind:value={m}
			on:change={async () => {
				$month = new _Month(Number(m.split('-')[1]), Number(m.split('-')[0]));
				getSchedule();
			}} />
	</div>
	<div slot="navigation" class="d-flex gap-2">
		<button class="btn btn-dark text-light text-nowrap" on:click={() => window.print()}>
			<i class="fa-solid fa-print" /> Печать
		</button>
		<button class="btn btn-dark" on:click={() => goto('/admin/schedule/edit')}>Редактировать</button>
	</div>
</PageTitleWrap>

{#if $month.fildsDayNotEmpty}
	<Month month={$month} />
{:else}
	<div class="text-dark">Расписание на {$month.monthName()} {$month.year} отсутствует!</div>
{/if}
