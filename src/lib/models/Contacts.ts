export class Contacts {
	scheduleOfWork: DayTime[] = [];
	phones: Phone[] = [];
	socialNetworks: Social[] = [];
	address: Address = new Address();

	constructor(scheduleOfWork = [], phones = [], socialNetworks = [], address = new Address()) {
		this.scheduleOfWork = scheduleOfWork;
		this.phones = phones;
		this.socialNetworks = socialNetworks;
		this.address = address;
	}
}

export class DayTime {
	day: string | null = null;
	time: string | null = null;

	constructor(day = null, time = null) {
		this.day = day;
		this.time = time;
	}
}

export class Phone {
	phone: string | null = null;
	title: string | null = null;

	constructor(phone = null, title = null) {
		this.phone = phone;
		this.title = title;
	}
}

export class Social {
	icon: string | null = null;
	title: string | null = null;
	url: string | null = null;

	constructor(icon = null, title = null, url = null) {
		this.icon = icon;
		this.title = title;
		this.url = url;
	}
}

export class Address {
	title: string | null = null;
	yandexMapsUrl: string;

	constructor(title = null, yandexMapsUrl = '') {
		this.title = title;
		this.yandexMapsUrl = yandexMapsUrl;
	}
}
