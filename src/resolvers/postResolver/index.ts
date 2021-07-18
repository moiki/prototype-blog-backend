import { Arg, Args, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { PostList } from './post.output';
import ErrorHandler from '../../middlewares/errorHandler';
import { Post, postModel, POST_STATUS } from '../../model/post.mongo';
import { GeneralResponse, ROLE_TYPE } from '../../utils/globalTypes/globalTypes';
import { PostInput } from './post.input';
import { IMyContext } from '../../MyGraphContext';

@Resolver()
export default class PostResolver {
	/** Query Section */
	@Query(() => [PostList!])
	async getPublishedPostList() {
		try {
			const posts = await postModel
				.find({ status: POST_STATUS.PUBLISHED })
				.populate('User')
				.populate('Tag')
				.populate('Category');
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
	@Query(() => [Post!])
	@Authorized()
	async getALlPost() {
		try {
			const allPosts = await postModel.find();
			return allPosts;
		} catch (error) {
			throw new ErrorHandler(error.message, error.code);
		}
	}

	@Query(() => Post)
	async loadPost(@Arg('id') id: string): Promise<Post | any> {
		try {
			const post = await postModel
				.findOne({ _id: id, status: POST_STATUS.PUBLISHED })
				.populate('tags')
				.populate('categories');
			if (!post) {
				throw new ErrorHandler('Post not found', 404);
			}
			return Post;
		} catch (error) {
			throw new ErrorHandler(error.message, error.code);
		}
	}

	@Mutation(() => GeneralResponse)
	@Authorized()
	async createPost(
		@Args() post: PostInput,
		@Ctx() { payload }: IMyContext,
	): Promise<GeneralResponse> {
		try {
			const exist = await postModel.findById(post.id);
			if (exist) {
				throw new ErrorHandler('This post already exist', 401);
			}
			const newPost = await postModel.create(post);
			if (!newPost) throw new ErrorHandler("Couldn't create post", 400);
			return payload!.role === ROLE_TYPE.MASTER
				? {
						message:
							post.status === POST_STATUS.PUBLISHED
								? 'Post created and published successfully!'
								: 'Post Created Successfully',
						status: true,
				  }
				: {
						message: 'Post Created Successfully',
						status: true,
				  };
		} catch (error) {
			throw new ErrorHandler(error.message, error.code);
		}
	}

	@Mutation(() => GeneralResponse)
	@Authorized()
	async setPostStatus(
		@Arg('id') id: string,
		@Arg('status') status: POST_STATUS,
	): Promise<GeneralResponse> {
		try {
			const exist = await postModel.findById(id);
			if (!exist) {
				throw new ErrorHandler('This post was not found', 404);
			}
			exist.status = status;
			await exist.save();
			return {
				message: `Post ${
					Object.keys(POST_STATUS).find((t) => t === status) || 'drafted'
				} successfully!`,
				status: true,
			};
		} catch (error) {
			throw new ErrorHandler(error.message, error.code);
		}
	}

	@Mutation(() => GeneralResponse)
	@Authorized()
	async updatePost(@Args() post: PostInput): Promise<GeneralResponse> {
		try {
			let exist = await postModel.findById(post.id);
			if (!exist) {
				throw new ErrorHandler('This post was not found', 404);
			}

			const updatedPost = await postModel.findOneAndUpdate({ _id: post.id }, { post });
			if (!updatedPost) throw new ErrorHandler("Couldn't create post", 400);
			return {
				message: 'Post Updated Successfully',
				status: true,
			};
		} catch (error) {
			throw new ErrorHandler(error.message, error.code);
		}
	}
}
