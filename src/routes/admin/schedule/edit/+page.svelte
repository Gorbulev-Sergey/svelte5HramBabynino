<script lang="ts">
	import { goto } from '$app/navigation';
	import { db } from '$lib/scripts/firebase';
	import { ref, set } from 'firebase/database';
	import { onDestroy, onMount } from 'svelte';
	import { Month } from '$lib/models/schedule/Month';
	import MonthEdit from '$lib/components/schedule/MonthEdit.svelte';
	import { scheduleMonth as month, subPanel } from '$lib/scripts/writableData';
	import PageTitleWrap from '$lib/components/PageTitleWrap.svelte';

	let m = $state('');
	$subPanel = subpanel;

	onDestroy(() => {
		$subPanel = undefined;
	});

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

{#snippet subpanel()}
	<PageTitleWrap title="Редактировать расписание">
		<div slot="center" class="input-group me-4">
			<span class="input-group-text bg-dark text-light border-0">Дата:</span>
			<input
				class="form-control bg-light text-dark border-0"
				type="month"
				bind:value={m}
				onchange={async () => {
					$month = new Month(Number(m.split('-')[1]), Number(m.split('-')[0]));
					getSchedule();
				}} />
		</div>
		<div slot="navigation" class="d-flex flex-nowrap align-items-center">
			<button class="btn btn-light me-1" onclick={() => goto('/admin/schedule')}>Отмена</button>
			<button
				class="btn btn-dark"
				onclick={async () => {
					// ВАЖНЫЙ ФИЛЬТР
					$month.fildsDayNotEmpty = $month.fildsDayAll.filter(fDate =>
						fDate.fildsTime.some(fTime => fTime.event != '')
					);
					// Удаляем пустые fildTime
					$month.fildsDayNotEmpty.forEach(fDay => {
						fDay.fildsTime = fDay.fildsTime.filter(
							fTime => fTime.event != '' || fTime.time != '00:00'
						);
					});
					set(
						ref(db, `schedule/${$month.year}/${$month.monthName()}`),
						Object.assign({}, $month.fildsDayNotEmpty)
					);
					goto('/admin/schedule');
				}}>Сохранить</button>
		</div>
	</PageTitleWrap>
{/snippet}

<MonthEdit bind:month={$month} />
