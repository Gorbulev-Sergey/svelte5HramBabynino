<script>
	import Month from '$lib/components/schedule/Month.svelte';
	import { Month as _Month } from '$lib/models/schedule/Month';
	import { scheduleMonth as month } from '$lib/scripts/store';
	import PageTitleWrap from '$lib/components/PageTitleWrap.svelte';
	import Container from '$lib/components/Container.svelte';
	import { onMount } from 'svelte';

	let m = $state(`${$month.year}-${$month.month < 10 ? '0' + $month.month : $month.month}`);
	let title = $derived(
		`Расписание богослужений на ${$month.monthName()?.toUpperCase()} ${$month.year} года`
	);
	let keywords = `бабынино, храм, храм бабынино, расписание богослужений`;

	onMount(async () => {
		await getSchedule();
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
			<!-- svelte-ignore a11y_incorrect_aria_attribute_type -->
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				aria-label=""
				class="btn btn-dark text-light text-nowrap me-2"
				onclick={() => window.print()}>
				<i class="fa-solid fa-print me-2"></i>Печать
			</div>
			<div class="input-group">
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
		</div>
	</PageTitleWrap>

	{#if $month.fildsDayNotEmpty}
		{#if $month.fildsDayNotEmpty.length > 0}
			<Month month={$month} />
		{/if}
	{:else}
		<div class="text-dark mx-1">
			Расписание богослужений на {$month.monthName()}
			{$month.year} отсутствует!
		</div>
	{/if}
</Container>
