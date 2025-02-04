export interface IFildTime {
	event: string;
	time: string;
	prayer: string;
}

export function FildTime(event = '', time = '', prayer = ''): IFildTime {
	return {
		event,
		time,
		prayer
	};
}
