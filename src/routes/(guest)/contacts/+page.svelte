<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';

	let { data } = $props();
	let contacts = data.contacts;
	let title = 'Контакты';
	let description = 'Контактная информация: телефоны, whatsapp, адрес храма';
	let keywords = `бабынино, храм, ${title}, храм бабынино`;
	let isCanScroollMap = $state(false);
</script>

<Container>
	<PageTitle {title} {description} {keywords} _class="mb-4 mx-2" />
	{#if contacts}
		<div class="row row-cols-1 row-cols-md-4 g-4">
			<div class="col-md-5">
				<div class="bg-white text-dark rounded p-3 w-100 h-100">
					<h5>Расписание работы храма:</h5>
					{#each contacts.scheduleOfWork as item}
						<div class="d-flex justify-content-between align-items-center mb-1">
							{item.day}
							<div class="badge bg-dark text-light">{item.time}</div>
						</div>
					{/each}
				</div>
			</div>
			<div class="col-md-5">
				<div class="bg-white text-dark rounded p-3 w-100 h-100">
					<h5>Контактные телефоны + whatsapp:</h5>
					{#each contacts.phones as item}
						<div class="d-flex justify-content-between align-items-center mb-1">
							{item.title}
							<div class="d-flex align-items-center gap-1">
								{#if item.title != 'храм'}
									<!-- svelte-ignore a11y_consider_explicit_label -->
									<a
										class="text-success"
										style="text-decoration: none;"
										href="https://api.whatsapp.com/send?phone={item.phone
											.replaceAll('-', '')
											.replace('89', '79')}"
										target="_blank"
										title="Написать в Whatsapp"
										rel="noopener noreferrer">
										<i class="fa-brands fa-whatsapp"></i>
									</a>
								{/if}
								<a
									class="badge bg-dark text-light"
									style="text-decoration: none;"
									href="tel:{item.phone}">{item.phone}</a>
							</div>
						</div>
					{/each}
				</div>
			</div>
			<div class="col-md-2">
				<div class="bg-white text-dark rounded p-3 w-100 h-100">
					<h5>Соцсети:</h5>
					{#each contacts.socialNetworks as item}
						<a
							class="btn btn-dark rounded-circle me-1 px-1"
							style="width: 2.5em; height:2.5em"
							href={item.url}
							target="_blank"
							title={item.title}>{@html item.icon}</a>
					{/each}
				</div>
			</div>
		</div>
		<div class="row mt-4">
			<div class="col">
				<div class="bg-white text-dark rounded p-3">
					<h5>Адрес храма:</h5>
					<p>{contacts.address.title}</p>
					<div class="rounded mb-2 w-100 position-relative" style="overflow:hidden; height:400px">
						<!-- on:mousemove={e => {
							if (e.shiftKey) isCanScroollMap = true;
							else isCanScroollMap = false;
						}}
						on:mouseleave={e => (isCanScroollMap = false)} -->
						<!-- <div class="position-absolute bg-dark bg-opacity-10 {isCanScroollMap ? 'd-none' : ''}" style="width:100%; height:100%"></div> -->
						<iframe
							title="карта"
							src={contacts.address.yandexMapsUrl.replace(
								'https://yandex.ru/maps/',
								'https://yandex.ru/map-widget/v1/'
							)}
							width="100%"
							height="100%"
							frameborder="1"
							allowfullscreen={true}></iframe>
					</div>
				</div>
			</div>
		</div>
	{/if}
</Container>
