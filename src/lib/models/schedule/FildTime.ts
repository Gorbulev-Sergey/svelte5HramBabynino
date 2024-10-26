export class FildTime {
	event: string = '';
	time: string = '00:00';
	prayer: string = '';

	constructor(event = '', time = '00:00', prayer = '') {
		this.event = event;
		this.time = time;
		this.prayer = prayer;
	}
}
