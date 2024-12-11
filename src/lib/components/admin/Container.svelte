<script lang="ts">
	let { children } = $props();
</script>

<div class="bg-white rounded mt-2 mb-5 mx-4 p-4">
	{@render children?.()}
</div>
