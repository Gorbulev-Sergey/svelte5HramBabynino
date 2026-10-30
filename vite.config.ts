import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		allowedHosts: [
			'hram-babynino.ru',
			'www.hram-babynino.ru',
			'babynino-hram.ru',
			'www.babynino-hram.ru',
			'localhost',
			'127.0.0.1'
		],
		port: 3000
	}
});
