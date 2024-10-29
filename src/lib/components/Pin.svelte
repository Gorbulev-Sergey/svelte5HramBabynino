<script lang="ts">
	class Props {
		text: string = '';
		classFontAwesome?: string;
		checked?: boolean | null;
		_class?: string;
		onChange? = () => {};
	}

	let {
		text,
		classFontAwesome,
		checked = $bindable(),
		_class,
		onChange = () => {}
	}: Props = $props();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="d-flex align-items-center {_class}"
	style="cursor:pointer;"
	onclick={() => {
		checked = !checked;
		onChange();
	}}>
	<i class="{classFontAwesome} {!checked ? 'text-secondary text-opacity-25' : ''} me-1"></i>
	<small class="pb-1">{text}</small>
</div>
