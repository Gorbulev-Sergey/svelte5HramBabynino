<script lang="ts">
	interface IProps {
		title?: string;
		list: string[];
		selectedItem: string | null;
		onSelect?: () => void;
	}

	let { title, list = [], selectedItem = $bindable(null), onSelect = () => {} }: IProps = $props();
</script>

<div class="btn-group btn-group-sm small">
	<div class="bg-white text-dark px-2 py-1 rounded-start" style="cursor:default;">
		{title}:
		<b>{selectedItem}</b>
	</div>
	<button
		aria-label={title}
		class="btn btn-sm btn-dark text-light rounded-end"
		data-bs-toggle="dropdown">
		<i class="fa-solid fa-chevron-down"></i>
	</button>
	<ul class="dropdown-menu" style="max-height: 75vh;">
		<li class="bg-light text-dark">
			<button
				class="dropdown-item"
				onclick={() => {
					selectedItem = null;
					onSelect();
				}}>{'null'}</button>
		</li>
		{#each [...list].sort((a, b) => a.localeCompare(b)) as item}
			<li class="bg-light text-dark">
				<button
					class="dropdown-item"
					onclick={() => {
						selectedItem = item;
						onSelect();
					}}>{item}</button>
			</li>
		{/each}
	</ul>
</div>
