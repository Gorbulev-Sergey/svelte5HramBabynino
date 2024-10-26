<script>
	export let classFontAwesome = '';
	export let text = '';
	export let checked = false;
	export let onChange = () => {};
	export let _class = '';
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class="d-flex align-items-center {_class}"
	style="cursor:pointer;"
	on:click={() => {
		checked = !checked;
		onChange();
	}}>
	<i class="{classFontAwesome} {!checked ? 'text-secondary text-opacity-25' : ''} me-1" />
	<small class="pb-1">{text}</small>
</div>
