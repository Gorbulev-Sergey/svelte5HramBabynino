<script>
	import { goto } from '$app/navigation';
	import Seo from '$lib/components/SEO.svelte';

	$effect.pre(() => {
		goto('/posts/главное');
	});
</script>

<Seo />
