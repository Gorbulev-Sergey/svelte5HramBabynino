export class Cover {
	image: string | null = null;
	video: string | null = null;

	constructor(image = null, video = null) {
		this.image = image;
		this.video = video;
	}
}
