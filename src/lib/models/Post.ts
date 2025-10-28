import { Cover, type ICover } from '$lib/models/Cover';
import type { ITag } from '$lib/models/Tag';
import type { IComment } from '$lib/models/Comment';
import { Colors } from './Colors';

export interface IPost {
	title: string;
	description: string | null;
	cover: ICover;
	content: string | null;
	created: string;
	published: boolean | null;
	pinned: boolean | null;
	inverted: boolean | null;
	tags: ITag[];
	comments: IComment[];
	userName: string | null;
	userUID: string | null;
	isHorisontal: boolean | null;
	isImageHeightFull: boolean | null;
	isHeightAuto: boolean | null;
	background: Colors | null;
}

export function Post(
	title = '',
	description = null,
	cover = Cover(),
	content = null,
	created = new Date().toISOString().slice(0, 10),
	published = true,
	pinned = null,
	inverted = null,
	tags: ITag[] = [],
	comments: IComment[] = [],
	userName = null,
	userUID = null,
	isHorisontal = null,
	isImageHeightFull = null,
	isHeightAuto = null,
	background = Colors.primary
): IPost {
	return {
		title,
		description,
		cover,
		content,
		created,
		published,
		pinned,
		inverted,
		tags,
		comments,
		userName,
		userUID,
		isHorisontal,
		isImageHeightFull,
		isHeightAuto,
		background
	};
}
