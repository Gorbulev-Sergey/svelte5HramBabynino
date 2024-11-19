import { type Cover } from '$lib/models/Cover';
import type { Tag } from '$lib/models/Tag';
import type { Comment } from '$lib/models/Comment';

export interface Post {
	title: string;
	description?: string;
	cover?: Cover;
	content?: string;
	created: string;
	published: boolean;
	pinned?: boolean;
	inverted?: boolean;
	tags: Tag[];
	comments: Comment[];
	userName?: string;
	userUID?: string;
	isHorisontal?: boolean;
	isImageHeightFull?: boolean;
	isHeightAuto?: boolean;
}
