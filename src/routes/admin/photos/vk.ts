export interface IVkAlbum {
	id: string;
	title: string;
	size: number;
}
export interface IVkPhoto {
	text: string;
	orig_photo: IOrig_photo;
}
export interface IOrig_photo {
	url: string;
}
