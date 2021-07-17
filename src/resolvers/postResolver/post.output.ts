import { Category } from '../../model/category.mongo';
import { Tag } from '../../model/tags.mongo';
import { Field, ObjectType } from 'type-graphql';

@ObjectType('PostList')
export class PostList {
	@Field()
	id: string;
	@Field()
	title: string;
	@Field()
	slug: string;
	@Field()
	author: string;
	@Field()
	thumbnail: string;
	@Field(() => [Category])
	categories: Category[];
	@Field(() => [Tag])
	tags: Tag[];
}

@ObjectType('SinglePost')
export class SinglePost {
	@Field()
	id: string;
	@Field()
	slug: string;
	@Field()
	title: string;
	@Field()
	author: string;
	@Field()
	thumbnail: string;
	@Field()
	featured_picture: string;
	@Field()
	publicationDate: string;
	@Field(() => [Category])
	categories: Category[];
	@Field(() => [Tag])
	tags: Tag[];
	@Field()
	content: string;
}
