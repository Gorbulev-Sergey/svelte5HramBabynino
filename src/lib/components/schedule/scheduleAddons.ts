// Названия месяцев в именительном падеже
export function monthToSring(date: Date) {
	return date.toLocaleString('Ru-ru', { month: 'long' });
}

// Названия месяцев с буквой "я" или "а" на конце (в родительном падеже)
export function monthToStringWithEnd(date: Date) {
	let m = date.getMonth() + 1;
	return Number(m) == 3 || Number(m) == 8
		? monthToSring(date).replace('т', 'та')
		: monthToSring(date).replace('ь', 'я');
}
