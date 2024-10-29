<script>
	import { goto } from '$app/navigation';

	$effect.pre(() => {
		goto('/posts/главное');
	});
</script>
