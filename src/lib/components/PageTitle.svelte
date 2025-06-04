<script>
	export let titleSpecial = '';
	export let title = 'Публикации';
	export let description =
		'Официальный сайт храма Вознесения Господня пос. Бабынино Калужской обл.';
	export let author = 'Горбулёв Сергей';
	export let copyright = 'Храм Вознесения Господня';
	export let address = '249210, Калужская обл., пос. Бабынино, Базарная пл., 1';
	export let keywords =
		'Бабынино храм Вознесения Господня, Бабынино церковь Вознесения Господня, Бабынино храм Вознесения Господня Калуга, Бабынино церковь Вознесения Господня Калуга';
	export let _class = '';
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
	class="d-flex justify-content-between flex-lg-nowrap flex-wrap align-items-start mb-3 no-print {_class}">
	<div class="d-flex justify-content-between align-items-baseline">
		<h4 class="text-dark ms-1 mb-0 me-3 text-nowrap fw-bold" style="font-size:1.5em">
			{@html title}
		</h4>
		<slot name="center" />
	</div>
	<slot name="navigation" />
</div>
