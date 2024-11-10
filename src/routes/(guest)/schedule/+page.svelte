<script>
	import Month from '$lib/components/schedule/Month.svelte';
	import { onMount } from 'svelte';
	import { Month as _Month } from '$lib/models/schedule/Month';
	import { scheduleMonth as month } from '$lib/scripts/store';
	import Spinner from '$lib/components/Spinner.svelte';
	import PageTitleWrap from '$lib/components/PageTitleWrap.svelte';
	import Container from '$lib/components/Container.svelte';

	let m = '';
	$: title = `Расписание богослужений на ${$month.monthName()?.toUpperCase()} ${$month.year} года`;
	$: keywords = `бабынино, храм, храм бабынино, расписание богослужений`;

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

<Container>
	<PageTitleWrap title="Расписание богослужений" description={title} {keywords} _class="mb-4">
		<div slot="navigation" class="d-flex">
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div class="btn btn-dark text-light text-nowrap me-2" on:click={() => window.print()}>
				<i class="fa-solid fa-print me-2" />Печать
			</div>
			<div class="input-group">
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
		</div>
	</PageTitleWrap>

	{#if $month.fildsDayNotEmpty}
		{#if $month.fildsDayNotEmpty.length > 0}
			<Month month={$month} />
		{/if}
	{:else}
		<div class="text-dark">Расписание на {$month.monthName()} {$month.year} отсутствует!</div>
	{/if}
</Container>
