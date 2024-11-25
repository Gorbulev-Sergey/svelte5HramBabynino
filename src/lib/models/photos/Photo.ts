export interface IPhoto {
	title: string;
	url: string;
}

export function Photo(title = '', url = ''): IPhoto {
	return {
		title: title,
		url: url
	};
}
