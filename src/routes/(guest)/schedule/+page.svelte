<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import PageTitleWrap from '$lib/components/PageTitleWrap.svelte';
	import MonthPicker from '$lib/components/schedule/MonthPicker.svelte';
	import Schedule from '$lib/components/schedule/Schedule.svelte';
	import { monthToSring } from '$lib/components/schedule/scheduleAddons';
	import { type IField } from '$lib/models/schedule/Field';
	import { SETTINGS } from '$lib/settings/settings.svelte';

	// Выбранная дата, год, месяц
	let year = $derived(SETTINGS.ADMIN.schedule.date.slice(0, 4));
	let month = $derived(SETTINGS.ADMIN.schedule.date.slice(5, 7));

	// Объект для хранения расписания за выбранный месяц
	let schedule = $state<{ [date: string]: IField[] }>(
		[] as unknown as { [date: string]: IField[] }
	);

	$effect(() => {
		schedule = {};
		// Запрос идёт через сервер сайта, т.к. Firebase может быть недоступен из браузера в некоторых регионах
		fetch('/api/schedule', {
			method: 'POST',
			body: JSON.stringify({ month: { year, name: Number(month) } })
		})
			.then(r => r.json())
			.then(data => {
				if (data) schedule = data;
			})
			.catch(e => console.error(e));
	});
</script>

<Container>
	<PageTitleWrap
		title={`Расписание богослужений на ${monthToSring(new Date(Number(year), Number(month) - 1)).toUpperCase()} ${year} года`}
		_class="mb-4">
		<div class="d-flex align-items-center gap-2">
			<MonthPicker title="на дату:" bind:date={SETTINGS.ADMIN.schedule.date} bind:month bind:year />
			<button
				hidden
				aria-label="Печать"
				class="btn btn-dark text-light text-nowrap"
				onclick={() => window.print()}>
				<i class="fa-solid fa-print"></i>
			</button>
		</div>
	</PageTitleWrap>

	<Schedule {schedule} />
</Container>
