<script lang="ts">
	import PageTitle from '$lib/components/admin/PageTitle.svelte';
	import MonthPicker from '$lib/components/schedule/MonthPicker.svelte';
	import Schedule from '$lib/components/schedule/Schedule.svelte';
	import { type IField } from '$lib/models/schedule/Field';
	import { db } from '$lib/settings/firebase';
	import { SETTINGS } from '$lib/settings/settings.svelte';
	import { get, ref } from 'firebase/database';
	import { onMount } from 'svelte';

	// Выбранная дата, год, месяц
	let year = $derived(SETTINGS.ADMIN.schedule.date.slice(0, 4));
	let month = $derived(SETTINGS.ADMIN.schedule.date.slice(5, 7));

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

	onMount(async () => {
		SETTINGS.ADMIN.Header = header;
	});
</script>

{#snippet header()}
	<PageTitle title="Расписание богослужений">
		<div class="flex-grow-1">
			<a class="btn btn-dark text-light text-nowrap" href="/admin/schedule/byWeeks">по месяцам</a>
		</div>
		<div class="d-flex align-items-center gap-2">
			<button
				aria-label="Печать"
				class="btn btn-dark text-light text-nowrap"
				onclick={() => window.print()}>
				<i class="fa-solid fa-print"></i>
			</button>
			<MonthPicker title="на дату:" bind:date={SETTINGS.ADMIN.schedule.date} bind:month bind:year />
			<a
				href="/admin/schedule/edit"
				aria-label="Редактировать"
				class="btn btn-dark text-light text-nowrap">Редактировать</a>
		</div>
	</PageTitle>
{/snippet}

<Schedule {schedule} />
