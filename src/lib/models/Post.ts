import { Cover } from '$lib/models/Cover';
import type { Tag } from '$lib/models/Tag';
import type { Comment } from '$lib/models/Comment';

export class Post {
	title: string = '';
	description: string | null = null;
	cover: Cover = new Cover();
	content: string | null = null;
	created: string = new Date().toISOString().slice(0, 10);
	published: boolean = true;
	pinned: boolean | null = null;
	inverted: boolean | null = null;
	tags: Tag[] = [];
	comments: Comment[] = [];
	userName: string | null = null;
	userUID: string | null = null;
	isHorisontal: boolean | null = null;
	isImageHeightFull: boolean | null = null;
	isHeightAuto: boolean | null = null;

	constructor(
		title = '',
		cover = new Cover(),
		description = null,
		content = null,
		created = new Date().toISOString().slice(0, 10),
		published = true,
		pinned = null,
		inverted = null,
		tags: Tag[] = [],
		comments: Comment[] = [],
		userName = null,
		userUID = null,
		isHorisontal = null
	) {
		this.title = title;
		this.cover = cover;
		this.description = description;
		this.content = content;
		this.created = created;
		this.published = published;
		this.pinned = pinned;
		this.inverted = inverted;
		this.tags = tags;
		this.comments = comments;
		this.userName = userName;
		this.userUID = userUID;
		this.isHorisontal = isHorisontal;
	}
}
