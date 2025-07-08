<script lang="ts">
	import { goto } from '$app/navigation';
	import { db } from '$lib/scripts/firebase';
	import { ref, set } from 'firebase/database';
	import { onDestroy, onMount } from 'svelte';
	import { Month } from '$lib/models/schedule/Month';
	import MonthEdit from '$lib/components/schedule/MonthEdit.svelte';
	import { scheduleMonth as month, Header } from '$lib/scripts/store';
	import PageTitle from '$lib/components/admin/PageTitle.svelte';

	let m = $state('');
	$Header = header;

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

	onMount(async () => {
		m = `${$month.year}-${$month.month < 10 ? '0' + $month.month : $month.month}`;
		getSchedule();
	});
	onDestroy(() => {
		$Header = null;
	});
</script>

{#snippet header()}
	<PageTitle title="Редактировать расписание">
		<div class="input-group w-25">
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
		<div class="flex-grow-1 justify-content-end d-flex flex-nowrap align-items-center">
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
							fTime =>
								fTime.event.trim() != '' || fTime.time != '00:00' || fTime.prayer.trim() != ''
						);
					});
					set(
						ref(db, `schedule/${$month.year}/${$month.monthName()}`),
						Object.assign({}, $month.fildsDayNotEmpty)
					);
					goto('/admin/schedule');
				}}>Сохранить</button>
		</div>
	</PageTitle>
{/snippet}

<MonthEdit bind:month={$month} _class="rounded p-3" />
