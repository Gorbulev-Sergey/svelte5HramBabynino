<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import PageTitleWrap from '$lib/components/PageTitleWrap.svelte';
	import MonthPicker from '$lib/components/schedule/MonthPicker.svelte';
	import { type IField } from '$lib/models/schedule/Field';
	import { db } from '$lib/scripts/firebase';
	import { get, ref } from 'firebase/database';

	// Выбранная дата, год, месяц
	let date = $state(new Date().toISOString().slice(0, 7));
	let year = $derived(date.slice(0, 4));
	let month = $derived(date.slice(5, 7));
	// Названия месяцев в именительном падеже
	let monthToSring = $derived(new Date(date).toLocaleString('Ru-ru', { month: 'long' }));
	// Названия месяцев с буквой "я" или "а" на конце (в родительном падеже)
	let monthToStringWithEnd = $derived(
		Number(month) == 3 || Number(month) == 8
			? monthToSring.replace('т', 'та')
			: monthToSring.replace('ь', 'я')
	);

	// Объект для хранения расписания за выбранный месяц
	let dataMonth = $state<{ [date: string]: IField[] }>(
		[] as unknown as { [date: string]: IField[] }
	);
	//Количество дней в месяце с расписанием
	let daysInDataMonth = $derived(Object.keys(dataMonth).length);

	$effect(() => {
		dataMonth = {};
		get(ref(db, `/schedule/${year}/${Number(month)}`)).then(r => {
			if (r.exists()) {
				dataMonth = r.val();
			}
		});
		console.log(1);
	});

	// Функция для настройки оформления наших элементов
	function getInputColors(date: string) {
		return new Date(date).getDay() == 0 ? 'text-danger' : 'text-dark';
	}
</script>

<Container>
	<PageTitleWrap title="Расписание богослужений" _class="mb-4">
		<div slot="navigation" class="d-flex align-items-center gap-2">
			<!-- svelte-ignore a11y_incorrect_aria_attribute_type -->
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<button
				aria-label=""
				class="btn btn-dark text-light text-nowrap"
				onclick={() => window.print()}>
				<i class="fa-solid fa-print me-1"></i>Печать
			</button>

			<MonthPicker title="на дату:" bind:date bind:month bind:year />
		</div>
	</PageTitleWrap>

	<div class="d-flex flex-column rounded bg-white">
		{#if daysInDataMonth > 0}
			<div class="no-print" style="display: grid; grid-template-columns: .15fr 1fr;">
				<div class="text-end py-2 ps-3 pe-2" style="min-width: 8.2em;">
					<span class="badge bg-dark text-light">Дата</span>
				</div>
				<div style="display: grid; grid-template-columns: 1fr .1fr .6fr">
					<div class="py-2 ps-3 pe-2" style="min-width: 13em;">
						<span class="badge bg-dark text-light">Праздник</span>
					</div>
					<div class="py-2 text-end" style="min-width: 5em;">
						<span class="badge bg-dark text-light">Время</span>
					</div>
					<div class="py-2 ps-4 ps-2 pe-3" style="min-width: 10em;">
						<span class="badge bg-dark text-light">Богослужение</span>
					</div>
				</div>
			</div>
		{/if}
		{#each Object.entries(dataMonth) as [date, item], i}
			<div
				class={`${new Date(date).getDay() == 0 ? 'bg-secondary text-danger bg-opacity-10' : 'bg-white text-dark'} 
					${i == daysInDataMonth - 1 ? 'rounded-bottom pb-1' : ''}`}
				style="display: grid; grid-template-columns: .15fr 1fr;">
				<div
					class="d-flex flex-column justify-content-start align-items-end py-1 ps-3 pe-2"
					style="min-width: 8em;">
					<b>{Number(date.slice(8, 10))} {monthToStringWithEnd}</b>
					<i>
						{new Date(date).toLocaleDateString('Ru-ru', {
							weekday: 'long'
						})}
					</i>
				</div>
				<div style="display: grid; grid-template-columns: 1fr .1fr .6fr">
					{#each item as field, j}
						<div class={`py-1 ps-3 pe-2 ${getInputColors(date)}`} style="min-width: 13em;">
							{@html dataMonth[date][j].event}
						</div>
						<div class={`py-1 text-end ${getInputColors(date)} fw-bold`} style="min-width: 5em;">
							{@html dataMonth[date][j].time}
						</div>
						<div
							class={`text-wrap py-1 ps-4 ps-2 pe-3 ${getInputColors(date)}`}
							style="min-width: 10em;">
							{@html dataMonth[date][j].pray}
						</div>
					{/each}
				</div>
			</div>
			{#if i != daysInDataMonth - 1}
				<hr class="my-0 mx-4 p-0 border-secondary border-opacity-50" />
			{/if}
		{/each}
	</div>
</Container>
