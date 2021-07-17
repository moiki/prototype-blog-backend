import { getModelForClass, modelOptions, plugin, pre, prop, Ref } from '@typegoose/typegoose';
import mongoPaginate from '../utils/mongoPaginate';
import { Field, ID, ObjectType } from 'type-graphql';
import { Base } from './abstract/base.mongo';
import { Category } from './category.mongo';
import { Tag } from './tags.mongo';
import { User } from './user.mongo';
const contextService = require('request-context');

export enum POST_STATUS {
	ARCHIVED = 'archived',
	DRAFTED = 'drafted',
	PUBLISHED = 'published',
}

@pre<Post>('save', async function (next): Promise<void> {
	const user = contextService.get('req:user');
	this.author = user.user;
	if (this.status === POST_STATUS.PUBLISHED) {
		this.publicationDate = new Date();
	}
	next();
})
@ObjectType('PostModel')
@modelOptions({ schemaOptions: { timestamps: true, collection: 'Post' } })
@plugin(mongoPaginate)
export class Post extends Base {
	@Field(() => ID)
	id: string;

	@prop({ required: true, text: true, index: true })
	@Field({ nullable: false })
	title: string;

	@prop({ required: true, text: true, index: true, unique: true })
	@Field({ nullable: false })
	slug: string;

	@prop({ required: true, text: true, index: false })
	@Field({ nullable: false })
	url: string;

	@prop({ required: true, text: true, index: false })
	@Field({ nullable: false })
	thumbnail: string;

	@prop({ required: true, text: true, index: false })
	@Field({ nullable: false })
	featured_picture: string;

	@prop({ required: true, index: false })
	@Field({ nullable: false })
	content: string;
	@prop({ enum: POST_STATUS, required: true, default: POST_STATUS.DRAFTED })
	@Field({ nullable: false })
	status: POST_STATUS;

	@prop({ ref: 'User', required: true })
	@Field(() => ID)
	author: Ref<User>;

	@prop({ required: true })
	@Field(() => Date, { nullable: false })
	publicationDate: Date;

	@prop({ ref: 'Category', required: false })
	categories?: Ref<Category>[];

	@prop({ ref: 'Tag', required: false })
	tags?: Ref<Tag>[];
}

export const postModel = getModelForClass(Post);
