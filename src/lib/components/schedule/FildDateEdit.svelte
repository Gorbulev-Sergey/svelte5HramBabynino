<script lang="ts">
	import { DayOfWeek } from '$lib/models/schedule/FildDate';
	import type { FildTime } from '$lib/models/schedule/FildTime';
	import type { FildDate } from '$lib/models/schedule/FildDate';
	import { Month } from '$lib/models/schedule/Month';
	import FildTimeEdit from './FildTimeEdit.svelte';

	export let fildDate: FildDate;
</script>

<div
	class="border-bottom border-dark border-opacity-25 {fildDate.dayOfWeek == DayOfWeek.воскресенье
		? 'bg-light text-danger'
		: ''}"
	style="display: grid; grid-template-columns: .14fr 1fr;min-width: 40em;">
	<div class="text-center px-2 py-1" style="min-width: 8em;">
		{@html new Date(fildDate.date).getDate()}
		{@html new Month(
			new Date(fildDate.date).getMonth() + 1,
			new Date(fildDate.date).getFullYear()
		).monthNameS()}
		{@html new Date(fildDate.date).getFullYear()}
		<br />
		<i>{@html fildDate.dayOfWeek}</i>
	</div>
	<div>
		{#each fildDate.fildsTime as item, i}
			{#if i == 0}
				<FildTimeEdit
					fildTime={item}
					onAdd={() => (fildDate.fildsTime = [...fildDate.fildsTime, {} as FildTime])} />
			{:else}
				<FildTimeEdit
					fildTime={item}
					isCanRemove={true}
					onRemove={() =>
						(fildDate.fildsTime = [...fildDate.fildsTime.filter(fTime => fTime != item)])} />
			{/if}
		{/each}
	</div>
</div>
