import { Arg, Authorized, Mutation, Query, Resolver } from "type-graphql";
import { PostList, SinglePost } from "./post.output";
import ErrorHandler from "../../middlewares/errorHandler";
import { Post, postModel, POST_STATUS } from "../../model/post.mongo";
import { GeneralResponse } from "../../utils/globalTypes/globalTypes";

@Resolver()
export default class PostResolver {
  /** Query Section */
  @Query(() => [PostList!])
  async getPostList() {
    try {
      const posts = await postModel
        .find({ status: POST_STATUS.PUBLISHED })
        .populate("Tag")
        .populate("Category");
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
  @Query(() => SinglePost)
  async loadPost(@Arg("id") id: string): Promise<SinglePost | any> {
    try {
      const post = await postModel.findById(id);
      if (!post) {
        throw new ErrorHandler("Post not found", 404);
      }

      return {
        id: post.id,
        slug: post.slug,
        title: post.title,
        author: post.author,
        thumbnail: post.thumbnail,
        featured_picture: post.featured_picture,
        publicationDate: post.publicationDate,
        categories: post.categories,
        tags: post.tags,
        content: post.content,
      };
    } catch (error) {
      throw new ErrorHandler(error.message, error.code);
    }
  }

  @Mutation(() => GeneralResponse)
  @Authorized()
  async createPost() {
    try {
    } catch (error) {
      throw new ErrorHandler(error.message, error.code);
    }
  }
}
