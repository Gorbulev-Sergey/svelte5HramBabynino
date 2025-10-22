<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import Swiper from 'swiper';
	import { Navigation, Pagination } from 'swiper/modules';
	import 'swiper/css';
	import 'swiper/css/navigation';
	import 'swiper/css/pagination';
	import { browser } from '$app/environment';

	let { data } = $props();
	let album = $derived(data.album);
	let sw: Swiper | undefined = $state();

	let downloadImage = async (imageSrc: string, i: number) => {
		fetch(imageSrc)
			.then(r => r.blob())
			.then(r => {
				let link = document.createElement('a');
				link.href = URL.createObjectURL(r);
				link.download = `${album.title.replace('"', '')}_${i + 1}`;
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			});
	};
	let goBack = () => {
		if (document.fullscreenElement) document.exitFullscreen();
		goto(`/photos#${data.uid}`);
	};

	$effect.pre(() => {
		document.documentElement.requestFullscreen();
		document.onfullscreenchange = e => {
			if (!document.fullscreenElement) {
				goto(`/photos#${data.uid}`, { replaceState: false });
				document.onfullscreenchange = r => {};
			}
		};
	});

	onMount(() => {
		sw = new Swiper('.swiper', {
			modules: [Navigation, Pagination],
			slidesPerView: 'auto',
			pagination: {
				el: '.swiper-pagination',
				clickable: true
			},
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev'
			},
			effect: 'flip',
			mousewheel: true
		});
	});
</script>

{#if browser}
	<div class="position-relative main" style="height:100svh;">
		{#if album.title}
			<div
				class="position-absolute w-100 d-flex justify-content-between align-items-center p-3"
				style="z-index:1000; left:0; top:0">
				<div class="d-flex gap-2 align-items-center">
					<button
						aria-label="Скачать фотографию"
						class="btn btn-light text-dark bg-light border-0 bg-opacity-75"
						title="Скачать фотографию"
						onclick={() => downloadImage(album.photos[sw.activeIndex].url, sw.activeIndex)}>
						<i class="fa-solid fa-download"></i>
					</button>
					<button
						aria-label="Скопировать url"
						class="btn btn-light text-dark bg-light border-0 bg-opacity-75"
						title="Скопировать url"
						onclick={() => {
							navigator.clipboard.writeText(album.photos[sw.activeIndex].url);
						}}>
						<i class="fa-solid fa-copy"></i>
					</button>
				</div>
				<button
					aria-label=""
					class="btn btn-light text-dark bg-light border-0 bg-opacity-75"
					title="Закрыть"
					onclick={() => goBack()}>
					<i class="fa-solid fa-xmark"></i>
				</button>
			</div>

			<div class="swiper">
				<div class="swiper-wrapper">
					{#each album.photos as photo, i}
						<div class="swiper-slide">
							<div
								class="h-100"
								style="background-image: url({photo.url});
							background-repeat: no-repeat; background-position: center; background-size: contain; min-height:100svh;">
							</div>
							{#if photo.title}
								<div class="carousel-caption my-text-white text-opacity-75 d-none d-md-block mb-2">
									{photo.title}
								</div>
							{/if}
						</div>
					{/each}
				</div>
				<div class="swiper-pagination"></div>

				<div class="swiper-button-prev my-text-white mx-4"></div>
				<div class="swiper-button-next my-text-white mx-4"></div>
			</div>
		{/if}
	</div>
{/if}

<style>
	:global(body),
	.main {
		background: #212529 !important;
		color: #f8f9fa !important;
	}
	.my-text-white {
		font-size: 1em;
		color: white;
	}
	:global(.swiper) {
		height: 100svh;
	}
	:global(.swiper-pagination) {
		scale: 1.2;
		margin-bottom: 1em;
		padding: 0 3em;
	}
	:global(.swiper-pagination-bullet-active) {
		background-color: #ffffff !important;
	}
</style>
