import { FildTime } from '$lib/models/schedule/FildTime';

export class FildDate {
	date: string = new Date().toISOString().slice(0, 10);
	fildsTime: FildTime[] = [new FildTime()];

	_dayOfWeek(day = 1) {
		switch (day) {
			case 0:
				return 'воскресенье';
			case 1:
				return 'понедельник';
			case 2:
				return 'вторник';
			case 3:
				return 'среда';
			case 4:
				return 'четверг';
			case 5:
				return 'пятница';
			case 6:
				return 'суббота';
		}
	}

	constructor(date = new Date().toISOString().slice(0, 10), fildsTime: FildTime[] = [new FildTime()]) {
		this.date = date;
		this.fildsTime = fildsTime;
	}
}
