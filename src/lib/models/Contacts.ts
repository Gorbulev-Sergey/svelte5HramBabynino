export interface Contacts {
	scheduleOfWork?: DayTime[];
	phones?: Phone[];
	socialNetworks?: Social[];
	address?: Address;
}

export class DayTime {
	day?: string;
	time?: string;
}

export interface Phone {
	phone?: string;
	title?: string;
}

export interface Social {
	icon?: string;
	title?: string;
	url?: string;
}

export interface Address {
	title?: string;
	yandexMapsUrl: string;
}
