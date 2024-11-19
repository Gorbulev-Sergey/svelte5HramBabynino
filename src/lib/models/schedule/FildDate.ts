import { type FildTime } from '$lib/models/schedule/FildTime';

export interface FildDate {
	date: string;
	fildsTime: FildTime[];
	dayOfWeek: DayOfWeek;
}

export enum DayOfWeek {
	воскресенье,
	понедельник,
	вторник,
	среда,
	четверг,
	пятница,
	суббота
}
