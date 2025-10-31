export let SETTINGS = $state({
	ADMIN: {
		Header: null,
		schedule: { date: new Date().toISOString().slice(0, 7) }
	},
	theme: {
		theme: 'light',
		isSystem: true
	},
	vkAccessToken:
		'vk1.a.xm0YSBut11g_tmJiIuGCV635mkYyBT_zGWun5haYma6SXcO92Npisia5FqCCl6FH4tFwvFRp0XLfU7a1YxKeZBQ02fk-cF4ej2GG0MUyY0DXOjc7OSZOzoBQ3mARjnzGa7-XKrSVg22c-JoBiGtaVuyphGEM6JcggO7B1sRLnEDKisNdVhkQRnBMYe8bg707VO2ujGHwyqGqhVLORupnkA',

	adminPanel: {
		columns: 6
	}
});
