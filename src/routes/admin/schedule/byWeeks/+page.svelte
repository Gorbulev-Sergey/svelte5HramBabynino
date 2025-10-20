<script lang="ts">
	import { db } from '$lib/scripts/firebase';
	import { get, ref } from 'firebase/database';
	import { onMount } from 'svelte';
	import PageTitle from '$lib/components/admin/PageTitle.svelte';
	import type { IField } from '$lib/models/schedule/Field';
	import WeekPicker from '$lib/components/schedule/WeekPicker.svelte';
	import { SETTINGS } from '$lib/store/store.svelte';
	import Schedule from '$lib/components/schedule/Schedule.svelte';

	let year = $state(new Date().getFullYear());

	// Объект для хранения расписания за выбранную неделю
	let schedule = $state<{ [date: string]: IField[] }>(
		[] as unknown as { [date: string]: IField[] }
	);
	let weekPicker = $state({
		min: 1,
		low: getWeek(new Date()),
		up: getWeek(new Date()),
		max: getWeeksInYear(year)
	});

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

	function getData() {
		let dates: string[] = [];
		for (let w = weekPicker.low; w <= weekPicker.up; w++) {
			dates = [...dates, ...getDatesByWeek(year, w)];
		}
		schedule = {};
		getScheduleByWeek(dates, schedule);
	}

	onMount(async () => {
		SETTINGS.Header = header;
		getData();
	});
</script>

{#snippet header()}
	<PageTitle title="Расписание богослужений">
		<div class="flex-grow-1">
			<a class="btn btn-dark text-light text-nowrap" href="/admin/schedule">по неделям</a>
		</div>
		<div class="d-flex align-items-center gap-2">
			<div class=" bg-white text-dark px-3 py-1 rounded">
				В <span class="badge bg-light text-dark">{year}</span> году
				<span class="badge bg-light text-dark">{getWeeksInYear(year)}</span> недели
			</div>
			<div>
				<WeekPicker
					title="Год:"
					min={1900}
					max={3000}
					bind:value={year}
					onDown={() => getData()}
					onUp={() => getData()}
					style="width: 4em;" />
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
				onclick={() => {
					window.print();
				}}>
				<i class="fa-solid fa-print"></i>
			</button>
		</div>
	</PageTitle>
{/snippet}

<Schedule {schedule} />
