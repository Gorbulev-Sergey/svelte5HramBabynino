import { type Cover } from '$lib/models/Cover';
import type { Tag } from '$lib/models/Tag';
import type { Comment } from '$lib/models/Comment';

export interface IPost {
	title: string;
	description?: string;
	cover?: Cover;
	content?: string;
	created: string;
	published: boolean;
	pinned?: boolean;
	inverted?: boolean;
	tags?: Tag[];
	comments?: Comment[];
	userName?: string;
	userUID?: string;
	isHorisontal?: boolean;
	isImageHeightFull?: boolean;
	isHeightAuto?: boolean;
}
export class Post implements IPost {
	title: string = $state('');
	description?: string = $state();
	cover?: Cover = $state();
	content?: string = $state();
	created: string = $state('');
	published: boolean = $state(true);
	pinned?: boolean = $state();
	inverted?: boolean = $state();
	tags: Tag[] = $bindable([]);
	comments?: Comment[] = $bindable([]);
	userName?: string = $state();
	userUID?: string = $state();
	isHorisontal?: boolean = $state();
	isImageHeightFull?: boolean = $state();
	isHeightAuto?: boolean = $state();
}
