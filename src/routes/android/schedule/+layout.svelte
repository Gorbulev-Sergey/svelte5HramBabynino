<script lang="ts">
	let { children } = $props();
</script>

<div class="my-3" style="min-height:60vh;">
	{@render children?.()}
</div>
