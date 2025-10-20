<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import PageTitleWrap from '$lib/components/PageTitleWrap.svelte';
	import MonthPicker from '$lib/components/schedule/MonthPicker.svelte';
	import Schedule from '$lib/components/schedule/Schedule.svelte';
	import { monthToSring } from '$lib/components/schedule/scheduleAddons';
	import { type IField } from '$lib/models/schedule/Field';
	import { db } from '$lib/scripts/firebase';
	import { SETTINGS } from '$lib/store/store.svelte';
	import { get, ref } from 'firebase/database';

	// Выбранная дата, год, месяц
	let year = $derived(SETTINGS.scheduleDate.slice(0, 4));
	let month = $derived(SETTINGS.scheduleDate.slice(5, 7));

	// Объект для хранения расписания за выбранный месяц
	let schedule = $state<{ [date: string]: IField[] }>(
		[] as unknown as { [date: string]: IField[] }
	);

	$effect(() => {
		schedule = {};
		get(ref(db, `/schedule/${year}/${Number(month)}`)).then(r => {
			if (r.exists()) {
				schedule = r.val();
			}
		});
		console.log(1);
	});
</script>

<Container>
	<PageTitleWrap
		title={`Расписание богослужений на ${monthToSring(new Date(Number(year), Number(month) - 1)).toUpperCase()} ${year} года`}
		_class="mb-4">
		<div slot="navigation" class="d-flex align-items-center gap-2">
			<MonthPicker title="на дату:" bind:date={SETTINGS.scheduleDate} bind:month bind:year />
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
