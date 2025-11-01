<script lang="ts">
	import type { IField } from '$lib/models/schedule/Field';
	import { monthToStringWithEnd } from './scheduleAddons';

	interface IProps {
		schedule: { [date: string]: IField[] };
	}

	let { schedule }: IProps = $props();

	// Функция для настройки оформления наших элементов
	function getInputColors(date: string) {
		return new Date(date).getDay() == 0 ? 'for-danger for-print' : 'text-dark for-print';
	}
</script>

<div class="d-flex flex-column rounded bg-white mx-2 overflow-x-auto">
	<h3 class="only-print text-center mb-3 text-uppercase">Расписание богослужений</h3>
	{#if Object.keys(schedule).length > 0}
		<div class="mb-1 no-print" style="display: grid; grid-template-columns: .15fr 1fr;">
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
		{#each Object.entries(schedule) as [date, item], i}
			<div
				class={`for-print ${new Date(date).getDay() == 0 ? 'bg-secondary text-danger bg-opacity-10' : 'bg-white text-dark'} 
					${i == Object.keys(schedule).length - 1 ? 'rounded-bottom pb-1' : ''}`}
				style="display: grid; grid-template-columns: .16fr 1fr;">
				<div
					class="d-flex flex-column justify-content-start text-center align-items-center py-1 px-2 for-print"
					style="min-width: 8em;">
					<b>{Number(date.slice(8, 10))} {monthToStringWithEnd(new Date(date))}</b>
					<i>
						{new Date(date).toLocaleDateString('Ru-ru', {
							weekday: 'long'
						})}
					</i>
				</div>
				<div class="py-1" style="display: grid; grid-template-columns: 1fr .1fr .4fr;">
					{#each item as field, j}
						<div class={`px-2 ${getInputColors(date)}`} style="min-width: 13em;">
							{@html schedule[date][j].event}
						</div>
						<div
							class="{`text-center text-end ${getInputColors(date)} fw-bold`} {item.length > 1 &&
							j < item.length - 1
								? 'border-bottom border-secondary border-opacity-10'
								: ''}"
							style="min-width: 5em;">
							{@html schedule[date][j].time}
						</div>
						<i
							class="{`text-wrap px-2 ${getInputColors(date)}`} {item.length > 1 &&
							j < item.length - 1
								? 'border-bottom border-secondary border-opacity-10'
								: ''}"
							style="min-width: 10em;">
							{@html schedule[date][j].pray}
						</i>
					{/each}
				</div>
			</div>
			{#if i != Object.keys(schedule).length - 1}
				<hr class="my-0 mx-0 p-0 border-secondary border-opacity-50" />
			{/if}
		{/each}
	{:else}
		<div class="text-center text-dark m-2">Пока ничего нет!</div>
	{/if}
</div>
