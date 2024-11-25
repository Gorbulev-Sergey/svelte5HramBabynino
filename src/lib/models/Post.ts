import { type ICover } from '$lib/models/Cover';
import type { ITag } from '$lib/models/Tag';
import type { IComment } from '$lib/models/Comment';

export interface IPost {
	title: string;
	description: string | null;
	cover: ICover | null;
	content: string | null;
	created: string;
	published: boolean;
	pinned: boolean | null;
	inverted: boolean | null;
	tags: ITag[];
	comments: IComment[];
	userName: string | null;
	userUID: string | null;
	isHorisontal: boolean | null;
	isImageHeightFull: boolean | null;
	isHeightAuto: boolean | null;
}
export class CPost implements IPost {
	title: string = $state('');
	description: string | null = $state(null);
	cover: ICover | null = $state(null);
	content: string | null = $state(null);
	created: string = $state('');
	published: boolean = $state(true);
	pinned: boolean | null = $state(null);
	inverted: boolean | null = $state(null);
	tags: ITag[] = $bindable([]);
	comments: IComment[] = $bindable([]);
	userName: string = $state('');
	userUID: string = $state('');
	isHorisontal: boolean | null = $state(null);
	isImageHeightFull: boolean | null = $state(null);
	isHeightAuto: boolean | null = $state(null);
}

export function Post(
	title = '',
	description = null,
	cover = null,
	content = null,
	created = '',
	published = true,
	pinned = null,
	inverted = null,
	tags = [],
	comments = [],
	userName = null,
	userUID = null,
	isHorisontal = null,
	isImageHeightFull = null,
	isHeightAuto = null
): IPost {
	return {
		title: title,
		description: description,
		cover: cover,
		content: content,
		created: created,
		published: published,
		pinned: pinned,
		inverted: inverted,
		tags: tags,
		comments: comments,
		userName: userName,
		userUID: userUID,
		isHorisontal: isHorisontal,
		isImageHeightFull: isImageHeightFull,
		isHeightAuto: isHeightAuto
	};
}
