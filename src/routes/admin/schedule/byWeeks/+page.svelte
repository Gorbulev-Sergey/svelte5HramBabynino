<script lang="ts">
	import { db } from '$lib/scripts/firebase';
	import { get, ref } from 'firebase/database';
	import { onMount } from 'svelte';
	import PageTitle from '$lib/components/admin/PageTitle.svelte';
	import type { IField } from '$lib/models/schedule/Field';
	import WeekPicker from '$lib/components/schedule/WeekPicker.svelte';
	import { SETTINGS } from '$lib/store/store.svelte';

	let week = $state(getWeek(new Date()));
	let year = $state(new Date().getFullYear());
	let month = $state(new Date().getMonth());

	// Объект для хранения расписания за выбранную неделю
	let dataSchedule = $state<{ [date: string]: IField[] }>(
		[] as unknown as { [date: string]: IField[] }
	);
	let weekPicker = $state({
		min: 1,
		low: getWeek(new Date()),
		up: getWeek(new Date()),
		max: getWeeksInYear(year)
	});

	// Названия месяцев в именительном падеже
	function monthToSring(date: Date) {
		return date.toLocaleString('Ru-ru', { month: 'long' });
	}
	// Названия месяцев с буквой "я" или "а" на конце (в родительном падеже)
	function monthToStringWithEnd(date: Date) {
		let m = date.getMonth() + 1;
		return Number(m) == 3 || Number(m) == 8
			? monthToSring(date).replace('т', 'та')
			: monthToSring(date).replace('ь', 'я');
	}

	function getWeek(date: Date) {
		let week1 = new Date(date.getFullYear(), 0, 1);
		return Math.round(
			1 + ((date.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7
		);
	}

	// Колличество недель в году
	function getWeeksInYear(year: number) {
		// 1 января года
		const firstDay = new Date(year, 0, 1);
		// 31 декабря года
		const lastDay = new Date(year, 11, 31);

		// Номер недели для 31 декабря
		const weeks = getWeek(lastDay);

		// Если номер недели 1, значит последний день попал в первую неделю следующего года,
		// значит в году 52 недели, иначе weeks = 52 или 53
		return weeks === 1 ? 52 : weeks;
	}

	function getDatesByWeek(year: number, week: number) {
		// Получаем первый день года
		const firstDayOfYear = new Date(year, 0, 1);

		// Находим первый понедельник года
		const firstMonday = firstDayOfYear.getDate() + ((1 - firstDayOfYear.getDay() + 7) % 7);
		const startOfWeek = new Date(year, 0, firstMonday + (week - 2) * 7);

		// Создаем массив для хранения дат
		const dates = [];

		// Заполняем массив датами с понедельника по воскресенье
		for (let i = 1; i < 8; i++) {
			const date = new Date(startOfWeek);
			date.setDate(startOfWeek.getDate() + i);
			dates.push(date.toISOString().slice(0, 10));
		}

		return dates;
	}

	async function getScheduleByWeek(dates: string[], schedule: { [date: string]: IField[] }) {
		dates.forEach(d => {
			get(ref(db, `/schedule/${d.slice(0, 4)}/${Number(d.slice(5, 7))}/${d}`)).then(r => {
				if (r.exists()) schedule[d] = r.val();
			});
		});
		return schedule;
	}

	// Функция для настройки оформления наших элементов
	function getInputColors(date: string) {
		return new Date(date).getDay() == 0 ? 'text-danger' : 'text-dark';
	}

	function getData() {
		let dates: string[] = [];
		for (let w = weekPicker.low; w <= weekPicker.up; w++) {
			dates = [...dates, ...getDatesByWeek(year, w)];
		}
		dataSchedule = {};
		getScheduleByWeek(dates, dataSchedule);
	}

	onMount(async () => {
		SETTINGS.Header = header;
		let dates: string[] = [];
		for (let w = weekPicker.low; w <= weekPicker.up; w++) {
			dates = [...dates, ...getDatesByWeek(year, w)];
		}
		getScheduleByWeek(dates, dataSchedule);
	});
</script>

{#snippet header()}
	<PageTitle title="Расписание">
		<div class="d-flex align-items-center gap-2">
			<div class=" bg-white text-dark px-3 py-1 rounded">
				В <span class="badge bg-light text-dark">{year}</span> году
				<span class="badge bg-light text-dark">{getWeeksInYear(year)}</span> недели
			</div>
			<div class="d-flex align-items-center rounded gap-1 mx-2">
				<WeekPicker
					title="Недели с:"
					bind:min={weekPicker.min}
					bind:max={weekPicker.up}
					bind:value={weekPicker.low}
					onDown={() => getData()}
					onUp={() => getData()} />
				<WeekPicker
					title="по:"
					bind:min={weekPicker.low}
					bind:max={weekPicker.max}
					bind:value={weekPicker.up}
					onDown={() => getData()}
					onUp={() => getData()} />
			</div>
			<button
				aria-label="Печать"
				class="btn btn-dark text-light text-nowrap"
				onclick={() => window.print()}>
				<i class="fa-solid fa-print"></i>
			</button>
		</div>
	</PageTitle>
{/snippet}

<div class="d-flex flex-column rounded bg-white mx-2">
	{#if Object.keys(dataSchedule).length > 0}
		<div class="mb-1" style="display: grid; grid-template-columns: .15fr 1fr;">
			<div class="text-center py-2 px-2" style="min-width: 8.2em;">
				<span class="badge bg-dark text-light">Дата</span>
			</div>
			<div style="display: grid; grid-template-columns: 1fr .1fr .4fr">
				<div class="py-2 text-start ps-4 pe-2" style="min-width: 13em;">
					<span class="badge bg-dark text-light">Праздник</span>
				</div>
				<div class="py-2 text-center px-2" style="min-width: 5em;">
					<span class="badge bg-dark text-light">Время</span>
				</div>
				<div class="py-2 text-start ps-4 pe-2" style="min-width: 10em;">
					<span class="badge bg-dark text-light">Богослужение</span>
				</div>
			</div>
		</div>
	{/if}
	{#each Object.entries(dataSchedule) as [date, item], i}
		<div
			class={`${new Date(date).getDay() == 0 ? 'bg-secondary text-danger bg-opacity-10' : 'bg-white text-dark'} 
					${i == Object.keys(dataSchedule).length - 1 ? 'rounded-bottom pb-1' : ''}`}
			style="display: grid; grid-template-columns: .16fr 1fr;">
			<div
				class="d-flex flex-column justify-content-start text-center align-items-center py-1 px-2"
				style="min-width: 8em;">
				<b>{Number(date.slice(8, 10))} {monthToStringWithEnd(new Date(date))}</b>
				<i>
					{new Date(date).toLocaleDateString('Ru-ru', {
						weekday: 'long'
					})}
				</i>
			</div>
			<div style="display: grid; grid-template-columns: 1fr .1fr .4fr">
				{#each item as field, j}
					<div class={`py-1 px-2 ${getInputColors(date)}`} style="min-width: 13em;">
						{@html dataSchedule[date][j].event}
					</div>
					<div
						class={`text-center py-1 text-end ${getInputColors(date)} fw-bold`}
						style="min-width: 5em;">
						{@html dataSchedule[date][j].time}
					</div>
					<div class={`text-wrap py-1 px-2 ${getInputColors(date)}`} style="min-width: 10em;">
						{@html dataSchedule[date][j].pray}
					</div>
				{/each}
			</div>
		</div>
		{#if i != Object.keys(dataSchedule).length - 1}
			<hr class="my-0 mx-0 p-0 border-secondary border-opacity-50" />
		{/if}
	{/each}
</div>
