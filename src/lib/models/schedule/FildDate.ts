import { type IFildTime } from '$lib/models/schedule/FildTime';

export enum DayOfWeek {
	воскресенье,
	понедельник,
	вторник,
	среда,
	четверг,
	пятница,
	суббота
}

export interface IFildDate {
	date: string;
	fildsTime: IFildTime[];
	dayOfWeek: DayOfWeek;
}

export function FildDate(date = '', fildsTime = [], dayOfWeek = DayOfWeek.воскресенье): IFildDate {
	return {
		date: date,
		fildsTime: fildsTime,
		dayOfWeek: dayOfWeek
	};
}
