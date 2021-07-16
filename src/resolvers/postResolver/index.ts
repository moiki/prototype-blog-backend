import { Query, Resolver } from 'type-graphql';
import { PostList } from './post.output';
import ErrorHandler from '../../middlewares/errorHandler';
import { Post, postModel, POST_STATUS } from '../../model/post.mongo';

@Resolver()
export default class PostResolver {
	/** Query Section */
	@Query(() => [PostList!])
	async getPostList() {
		try {
			const posts = await postModel.find({ status: POST_STATUS.PUBLISHED });
			return posts.map((post: Post) => {
				return {
					id: post.id,
					title: post.title,
					slug: post.slug,
					author: post.author,
					thumbnail: post.thumbnail,
					categories: post.categories,
					tags: post.tags,
				};
			});
		} catch (error) {
			throw new ErrorHandler(error.message, error.code);
		}
	}
}
