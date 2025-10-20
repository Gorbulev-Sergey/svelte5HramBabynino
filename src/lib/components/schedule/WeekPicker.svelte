<script lang="ts">
	interface IProps {
		title?: string;
		min: number;
		max: number;
		value: number;
		onDown?: () => void;
		onUp?: () => void;
		style?: string;
	}
	let {
		title = '',
		min = $bindable(0),
		max = $bindable(50),
		value = $bindable(10),
		onDown = () => {},
		onUp = () => {},
		style = 'width: 2.5em;'
	}: IProps = $props();
</script>

<div class="d-flex align-items-center">
	<div class="p-2 text-dark">{title}</div>
	<div class="d-flex align-items-center rounded border border-light gap-1">
		<button
			aria-label=""
			class="btn btn-dark text-light"
			onclick={() => {
				value > min ? value-- : value;
				onDown();
			}}><i class="fa-solid fa-angle-left"></i></button>
		<input
			class="form-control border-0 text-center px-1 no-buttons bg-white text-dark"
			{style}
			type="number"
			bind:value />
		<button
			aria-label=""
			class="btn btn-dark text-light"
			onclick={() => {
				value < max ? value++ : value;
				onUp();
			}}><i class="fa-solid fa-angle-right"></i></button>
	</div>
</div>

<style>
	.no-buttons::-webkit-inner-spin-button,
	.no-buttons::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
	.no-buttons {
		-moz-appearance: textfield;
	}
</style>
