<script>
	import { db } from '$lib/scripts/firebase';
	import { onValue, ref } from 'firebase/database';
	import Month from '$lib/components/schedule/Month.svelte';
	import { onMount } from 'svelte';
	import { Month as _Month } from '$lib/models/schedule/Month';
	import { scheduleMonth as month } from '$lib/scripts/writableData';
	import PageTitleWrap from '$lib/components/PageTitleWrap.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import { theme } from '$lib/scripts/writableData';
	import Large from '$lib/components/Breakpoint/Large.svelte';
	import Small from '$lib/components/Breakpoint/Small.svelte';

	let m = '';
	let changeTheme = () => {
		$theme = $theme == 'light' ? 'dark' : 'light';
		localStorage.setItem('theme', $theme);
	};

	function loadData() {
		onValue(ref(db, `schedule/${$month.year}/${$month.monthName()}`), result => {
			$month.fildsDayNotEmpty = result.val();
			$month.updateFildsDayAll();
		});
	}

	onMount(async () => {
		m = `${$month.year}-${$month.month < 10 ? '0' + $month.month : $month.month}`;
		loadData();
	});
</script>

<div class="no-print container">
	<PageTitleWrap title="">
		<div
			slot="navigation"
			class="d-flex flex-wrap justify-content-between align-items-center gap-2"
			style="margin-top:-1.4em">
			<div class="d-flex w-100 align-items-center justify-content-between">
				<h4 class="text-dark mb-0">Расписание богослужений</h4>
				<button
					class="btn btn-light bg-transparent text-dark border-0"
					on:click={async () => changeTheme()}
					aria-label="смена темы">
					<i class="fa-regular fa-sun"></i>
				</button>
			</div>
			<div class="input-group">
				<span class="input-group-text bg-dark text-light border-0">дата:</span>
				<input
					class="form-control bg-light text-dark border-0"
					type="month"
					bind:value={m}
					on:change={async () => {
						$month = new _Month(Number(m.split('-')[1]), Number(m.split('-')[0]));
						loadData();
					}} />
			</div>
		</div>
	</PageTitleWrap>
</div>

{#if $month.fildsDayNotEmpty}
	{#if $month.fildsDayNotEmpty.length > 0}
		<Large>
			<div class="container">
				<Month month={$month} _class="pt-3" />
			</div>
		</Large>
		<Small>
			<Month month={$month} _class="pt-3" />
		</Small>
	{:else}
		<Spinner />
	{/if}
{:else}
	<div class="text-dark my-2">Расписание на {$month.monthName()} {$month.year} отсутствует!</div>
{/if}
