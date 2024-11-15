<script>
	import { dev } from '$app/environment';
	import Theme from '$lib/components/Theme.svelte';
	import '@fortawesome/fontawesome-free/css/all.min.css';

	let { children } = $props();
</script>

<Theme />
{@render children?.()}
