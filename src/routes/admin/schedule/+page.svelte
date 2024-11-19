<script lang="ts">
	import Month from '$lib/components/schedule/Month.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { Month as _Month } from '$lib/models/schedule/Month';
	import PageTitle from '$lib/components/admin/PageTitle.svelte';
	import { goto } from '$app/navigation';
	import { Header, scheduleMonth as month } from '$lib/scripts/store';

	let m = $state(`${$month.year}-${$month.month < 10 ? '0' + $month.month : $month.month}`);
	$Header = header;

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

	onMount(async () => {
		getSchedule();
	});
	onDestroy(() => ($Header = null));
</script>

{#snippet header()}
	<PageTitle title={`Расписание богослужений на`}>
		<div class="input-group w-25">
			<span class="input-group-text bg-dark text-light border-0">Дата:</span>
			<input
				class="form-control bg-light text-dark border-0"
				type="month"
				bind:value={m}
				onchange={async () => {
					$month = new _Month(Number(m.split('-')[1]), Number(m.split('-')[0]));
					await getSchedule();
				}} />
		</div>
		<div class="flex-grow-1 justify-content-end d-flex gap-1">
			<button class="btn btn-dark text-light text-nowrap" onclick={() => window.print()}>
				<i class="fa-solid fa-print me-1"></i>Печать
			</button>
			<button class="btn btn-dark" onclick={() => goto('/admin/schedule/edit')}
				>Редактировать</button>
		</div>
	</PageTitle>
{/snippet}

{#if $month.fildsDayNotEmpty}
	<Month month={$month} _class="pt-2" />
{:else}
	<div class="text-dark">
		Расписание богослужений на {$month.monthName()}
		{$month.year} отсутствует!
	</div>
{/if}
