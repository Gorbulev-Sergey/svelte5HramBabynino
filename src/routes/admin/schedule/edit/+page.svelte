<script lang="ts">
	import PageTitle from '$lib/components/admin/PageTitle.svelte';
	import MonthPicker from '$lib/components/schedule/MonthPicker.svelte';
	import { Field, type IField } from '$lib/models/schedule/Field';
	import { db } from '$lib/scripts/firebase';
	import { Header } from '$lib/scripts/store';
	import { get, ref, set } from 'firebase/database';
	import { onDestroy } from 'svelte';

	// Выбранная дата, год, месяц
	let date = $state(new Date().toISOString().slice(0, 7));
	let year = $derived(date.slice(0, 4));
	let month = $derived(date.slice(5, 7));
	//Количество дне в выбранном месяце
	let daysInMonth = $derived(new Date(Number(year), Number(month), 0).getDate());
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

	$effect(() => {
		let a: { [date: string]: IField[] } = {};
		for (let i = 0; i < daysInMonth; i++) {
			a[`${year}-${month}-${i < 9 ? '0' : ''}${i + 1}`] = [Field()];
		}
		dataMonth = a;
		get(ref(db, `/schedule/${year}/${Number(month)}`)).then(r => {
			if (r.exists()) {
				let result = r.val() as { [date: string]: IField[] };
				Object.keys(result).forEach(k => {
					dataMonth[k] = result[k];
				});
			}
		});
		console.log(daysInMonth);
	});

	// Функция для настройки оформления наших элементов
	function getInputColors(date: string) {
		return new Date(date).getDay() == 0 ? 'text-danger' : 'text-dark';
	}

	$Header = header;
	onDestroy(() => ($Header = null));
</script>

{#snippet header()}
	<PageTitle title="Редактировать расписание богослужений">
		<div class="d-flex align-items-center gap-2">
			<button
				aria-label="Печать"
				class="btn btn-dark text-light text-nowrap"
				onclick={() => window.print()}>
				<i class="fa-solid fa-print"></i>
			</button>
			<MonthPicker title="на дату:" bind:date bind:month bind:year />
			<a href="/admin/schedule" aria-label="Отмена" class="btn btn-light text-dark text-nowrap"
				>Отмена</a>
			<a
				href="/admin/schedule"
				aria-label="Сохранить"
				class="btn btn-dark text-light text-nowrap"
				onclick={() => {
					let result: { [date: string]: IField[] } = {};
					for (let i = 0; i < daysInMonth; i++) {
						dataMonth[`${year}-${month}-${i < 9 ? '0' : ''}${i + 1}`].forEach(() => {
							result[`${year}-${month}-${i < 9 ? '0' : ''}${i + 1}`] = dataMonth[
								`${year}-${month}-${i < 9 ? '0' : ''}${i + 1}`
							].filter(v => v.event.trim() != '' || v.pray.trim() != '');
						});
					}

					set(ref(db, `/schedule/${year}/${Number(month)}`), result);
				}}>Сохранить</a>
		</div>
	</PageTitle>
{/snippet}

<div class="d-flex flex-column rounded">
	<div class="d-flex align-items-center no-print mb-1 w-100">
		<div class="text-center py-2 px-2" style="min-width: 9em;">
			<span class="badge bg-dark text-light">Дата</span>
		</div>
		<div class="flex-grow-1 d-flex">
			<div class="py-2 text-start ps-5 pe-2 ms-3 flex-grow-1 w-75" style="min-width: 13em;">
				<span class="badge bg-dark text-light">Праздник</span>
			</div>
			<div class="py-2 text-start pe-2" style="width: 8em;">
				<span class="badge bg-dark text-light">Время</span>
			</div>
			<div class="py-2 text-start ps-3 pe-2" style="width: 24em;">
				<span class="badge bg-dark text-light">Богослужение</span>
			</div>
		</div>
	</div>
	{#each Object.entries(dataMonth) as [date, item], i}
		<div
			class={`d-flex
						${new Date(date).getDay() == 0 ? 'bg-secondary text-danger bg-opacity-10' : 'bg-white text-dark'}  
						${i == 0 ? 'rounded-top' : ''} 
						${i == daysInMonth - 1 ? 'rounded-bottom' : ''}`}>
			<div class={`px-2 py-1 text-nowrap text-center`} style="min-width: 9em;">
				<div class="d-flex flex-column">
					<b>{Number(date.slice(8, 10))} {monthToStringWithEnd}</b>
					<div>
						{new Date(date).toLocaleDateString('Ru-ru', {
							weekday: 'long'
						})}
					</div>
				</div>
			</div>
			<button
				class={`btn btn-light my-1 ${new Date(date).getDay() == 0 ? 'bg-dark bg-opacity-10 text-danger' : ' bg-light text-dark'} fw-bold rounded-1 px-2`}
				onclick={() => {
					item.push(Field());
				}}>+</button>
			<div class="flex-grow-1 d-flex flex-column">
				{#each item as field, j}
					<div class="d-flex h-100">
						<div class="d-flex justify-content-end w-75 ms-1 {j == 0 ? 'pt-1' : ''} pb-1">
							{#if item.length > 1}
								<button
									class={`btn btn-light ${new Date(date).getDay() == 0 ? 'bg-dark bg-opacity-10 text-danger' : 'bg-light text-dark'} fw-bold rounded-1 px-2`}
									onclick={() => item.splice(j, 1)}>-</button>
							{/if}
							<input
								class={`form-control bg-light bg-transparent border-0 rounded-0 ${getInputColors(date)} my-1 ms-1`}
								bind:value={dataMonth[date][j].event}
								placeholder=""
								title="Праздник" />
						</div>
						<input
							type="time"
							class={`form-control bg-transparent border-0 rounded-0 ${getInputColors(date)} ${field.time != '00:00' ? 'fw-bold' : 'text-opacity-25'} my-1 px-2`}
							style="width: 8em;"
							bind:value={dataMonth[date][j].time}
							title="Время" />
						<input
							multiple
							class={`form-control bg-transparent border-0 rounded-0 ${getInputColors(date)} my-1 me-1 px-2`}
							style="width: 24em;"
							bind:value={dataMonth[date][j].pray}
							title="Богослужение" />
					</div>
				{/each}
			</div>
		</div>
	{/each}
</div>
