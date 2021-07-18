import { POST_STATUS } from '../../model/post.mongo';
import { ArgsType, Field, ID, registerEnumType } from 'type-graphql';

registerEnumType(POST_STATUS, { name: 'dateGroup' });
@ArgsType()
export class PostInput {
	@Field()
	id: string;
	@Field()
	slug: string;
	@Field()
	title: string;
	@Field()
	thumbnail: string;
	@Field()
	featured_picture: string;
	@Field(() => [ID])
	categories: string[];
	@Field(() => [ID])
	tags: String[];
	@Field()
	content: string;
	@Field(() => POST_STATUS, { defaultValue: POST_STATUS.DRAFTED })
	status: POST_STATUS;
}
