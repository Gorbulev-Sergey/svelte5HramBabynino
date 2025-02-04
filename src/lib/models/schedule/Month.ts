import { type IFildDate } from './FildDate';

export interface IMonth {
	month: number;
	year: number;
	fildsDayAll: IFildDate[];
	fildsDayNotEmpty: IFildDate[];
	daysInMonth: number;
	setFildsDayAll(): void;
	updateFildsDayAll(): void;
}

export class CMonth {
	month: number = new Date().getMonth();
	year: number = new Date().getFullYear();
	fildsDayAll: IFildDate[] = [];
	fildsDayNotEmpty: IFildDate[] = [];
	daysInMonth = () => new Date(this.year, this.month, 0).getDate();

	setFildsDayAll = () => {
		for (let i = 1; i <= this.daysInMonth(); i++) {
			// this.fildsDayAll.push(
			// 	FildDate(
			// 		`${this.year}-${this.month < 10 ? `0${this.month}` : this.month}-${i < 10 ? `0${i}` : i}`
			// 	)
			// );
		}
	};
	updateFildsDayAll = () => {
		this.fildsDayNotEmpty?.forEach(fDay => {
			this.fildsDayAll[
				this.fildsDayAll.indexOf(this.fildsDayAll.filter(f => f.date == fDay.date)[0])
			] = fDay;
		});
	};

	public monthNameS = () => {
		switch (this.month) {
			case 1:
				return 'января';
			case 2:
				return 'февраля';
			case 3:
				return 'марта';
			case 4:
				return 'апреля';
			case 5:
				return 'мая';
			case 6:
				return 'июня';
			case 7:
				return 'июля';
			case 8:
				return 'августа';
			case 9:
				return 'сентября';
			case 10:
				return 'октября';
			case 11:
				return 'ноября';
			case 12:
				return 'декабря';
		}
	};
	public monthName = () => {
		switch (this.month) {
			case 1:
				return 'январь';
			case 2:
				return 'февраль';
			case 3:
				return 'март';
			case 4:
				return 'апрель';
			case 5:
				return 'май';
			case 6:
				return 'июнь';
			case 7:
				return 'июль';
			case 8:
				return 'август';
			case 9:
				return 'сентябрь';
			case 10:
				return 'октябрь';
			case 11:
				return 'ноябрь';
			case 12:
				return 'декабрь';
		}
	};

	constructor(month = 1, year = new Date().getFullYear()) {
		this.month = month;
		this.year = year;

		this.setFildsDayAll();
		this.updateFildsDayAll();
	}
}

export function Month(
	month = 1,
	year = 2024,
	fildsDayAll = [],
	fildsDayNotEmpty = [],
	daysInMonth = 30,
	setFildsDayAll = () => {},
	updateFildsDayAll = () => {}
): IMonth {
	return {
		month,
		year,
		fildsDayAll,
		fildsDayNotEmpty,
		daysInMonth,
		setFildsDayAll,
		updateFildsDayAll
	};
}
