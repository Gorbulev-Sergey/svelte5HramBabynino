export interface IContacts {
	scheduleOfWork: IDayTime[];
	phones: IPhone[];
	socialNetworks: ISocial[];
	address: IAddress;
}

export function Contacts(
	scheduleOfWork = [],
	phones = [],
	socialNetworks = [],
	address: IAddress = {
		title: '',
		yandexMapsUrl: ''
	}
): IContacts {
	return {
		scheduleOfWork: scheduleOfWork,
		phones: phones,
		socialNetworks: socialNetworks,
		address: address
	};
}

export interface IDayTime {
	day: string;
	time: string;
}

export interface IPhone {
	phone: string;
	title: string;
}

export interface ISocial {
	icon: string;
	title: string;
	url: string;
}

export interface IAddress {
	title: string;
	yandexMapsUrl: string;
}
