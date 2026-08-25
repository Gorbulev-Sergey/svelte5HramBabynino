<script lang="ts">
	import type { Snippet } from 'svelte';

	interface IProps {
		titleSpecial?: string;
		title?: string;
		description?: string;
		author?: string;
		copyright?: string;
		address?: string;
		keywords?: string;
		_class?: string;
		children?: Snippet;
		center?: Snippet;
	}

	let {
		titleSpecial = '',
		title = 'Публикации',
		description = 'Официальный сайт храма Вознесения Господня пос. Бабынино Калужской обл.',
		author = 'Горбулёв Сергей',
		copyright = 'Храм Вознесения Господня',
		address = '249210, Калужская обл., пос. Бабынино, Базарная пл., 1',
		keywords = 'Бабынино храм Вознесения Господня, Бабынино церковь Вознесения Господня, Бабынино храм Вознесения Господня Калуга, Бабынино церковь Вознесения Господня Калуга',
		_class = '',
		children,
		center
	}: IProps = $props();
</script>

<svelte:head>
	<title>{titleSpecial == '' ? title : titleSpecial}</title>
	<meta name="description" content={description} />
	<meta name="author" content={author} />
	<meta name="copyright" content={copyright} />
	<meta name="address" content={address} />
	<meta name="keywords" content={keywords} />
</svelte:head>

<div
	class="d-flex justify-content-between flex-wrap align-items-center mb-3 no-print mx-1 {_class}">
	<div class="d-flex justify-content-between align-items-center flex-wrap">
		<b class="text-dark py-1 text-nowrap text-uppercase" style="font-size: 1.1em;">
			{@html title}
		</b>
		<div class="mt-2 my-md-0">
			{@render center?.()}
		</div>
	</div>
	<div class="mt-2 my-md-0">
		{@render children?.()}
	</div>
</div>
