import { Tag, tagModel } from "../../model/tags.mongo";
import { Args, Authorized, Mutation, Query, Resolver } from "type-graphql";
import ErrorHandler from "../../middlewares/errorHandler";
import { TagInput } from "./tag.input";
import { GeneralResponse } from "../../utils/globalTypes/globalTypes";

@Resolver()
export default class TagsResolver {
  /** Query Section */
  @Query(() => [Tag])
  @Authorized()
  async getAllTags(): Promise<Tag[]> {
    try {
      const tags = await tagModel.find();
      return tags;
    } catch (error) {
      throw new ErrorHandler(error.message, error.code);
    }
  }

  /** Mutation Section */
  @Mutation(() => GeneralResponse)
  @Authorized(["Master"])
  async createTag(@Args() tag: TagInput): Promise<GeneralResponse> {
    try {
      const result = await tagModel.create(tag);
      if (result) {
        return {
          message: "tag created!",
          status: true,
        };
      }
      return {
        message: "Createion Failed!",
        status: false,
      };
    } catch (error) {
      throw new ErrorHandler(error.message, error.code);
    }
  }
  @Mutation(() => GeneralResponse)
  @Authorized(["Master"])
  async updateTag(@Args() tag: TagInput): Promise<GeneralResponse> {
    try {
      const search = await tagModel.findById(tag.id);
      if (!search) return { message: "This tag was not found!", status: false };
      const result = await tagModel.updateOne(
        { _id: tag.id },
        { name: tag.name, description: tag.description }
      );
      if (result) {
        return {
          message: "Tag Updated!",
          status: true,
        };
      }
      return {
        message: "Update Failed!",
        status: false,
      };
    } catch (error) {
      throw new ErrorHandler(error.message, error.code);
    }
  }
}
