/**
 * @property scheduleDate - Дата выбранная в календаре *
 */
export let SETTINGS = $state({
	scheduleDate: new Date().toISOString().slice(0, 7)
});
