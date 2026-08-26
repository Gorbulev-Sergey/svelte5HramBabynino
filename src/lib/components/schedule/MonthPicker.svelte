<script lang="ts">
	interface IProps {
		title: string;
		date: string;
		year: string;
		month: string;
	}
	let {
		title = '',
		date = $bindable(new Date().toISOString().slice(0, 7)),
		year = $bindable(date.slice(0, 4)),
		month = $bindable(date.slice(5, 7))
	}: IProps = $props();
</script>

<div class="d-flex align-items-center">
	<div class="p-2 text-nowrap bg-transparent text-dark">{title}</div>
	<div class="d-flex align-items-center rounded">
		<button
			title="предыдущий месяц"
			class="btn btn-sm btn-dark text-light border-0 rounded-1 rounded-end-0 px-2"
			onclick={() =>
				(date = new Date(Number(year), Number(month) - 1, 1).toISOString().slice(0, 7))}
			><i class="fa-solid fa-chevron-left"></i></button>
		<input
			class="form-control text-center bg-light text-dark rounded-0 border-0 justify-content-center ps-1 z-1"
			type="month"
			bind:value={date} />
		<button
			title="текущий месяц"
			class="btn btn-sm btn-dark text-light border-0 rounded-0 px-2"
			onclick={() => (date = new Date().toISOString().slice(0, 7))}
			><i class="fa-solid fa-rotate-left"></i></button>
		<button
			title="следующий месяц"
			class="btn btn-sm btn-dark text-light border-0 rounded-1 px-2 rounded-start-0 justify-content-center"
			onclick={() =>
				(date = new Date(Number(year), Number(month) + 1, 1).toISOString().slice(0, 7))}
			><i class="fa-solid fa-chevron-right"></i></button>
	</div>
</div>
