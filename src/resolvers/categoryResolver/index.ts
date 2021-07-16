import ErrorHandler from "../../middlewares/errorHandler";
import { Arg, Args, Authorized, Mutation, Query, Resolver } from "type-graphql";
import { Category, categoryModel } from "../../model/category.mongo";
import { CategoryInput } from "./category.input";
import { GeneralResponse } from "src/utils/globalTypes/globalTypes";

@Resolver()
export default class CategoryResolver {
   /** Query Section */
  @Query(()=> [Category])
  @Authorized()
  async getAllCategories(): Promise<Category[]> {
    try {
      const categories = await categoryModel.find();
      return categories;
    } catch (error) {
      throw new ErrorHandler(error.message, error.code);
    }
  }
  @Query(()=> Category)
  @Authorized()
   async getOneCategory(
    @Arg('id') id: string
  ): Promise<Category|any> {
    try {
      const category = await categoryModel.findById(id);
      return category;
    } catch (error) {
      throw new ErrorHandler(error.message, error.code);
    }
  }
  /** Mutation Section */
  @Mutation()
  @Authorized(['Master'])
  async createCategory(
    @Args() category: CategoryInput
  ): Promise<GeneralResponse> {
    try {
      const result = await categoryModel.create(category);
      if (result) {
        return {
          message: "Category created!",
          status: true
        }
      }
        return {
          message: "Createion Failed!",
          status: false
        }
    } catch (error) {
      throw new ErrorHandler(error.message, error.code);
    }
  }
   @Mutation()
  @Authorized(['Master'])
  async updateCategory(
    @Args() category: CategoryInput
  ): Promise<GeneralResponse> {
     try {
       const search = await categoryModel.findById(category.id);
       if (!search) return { message: "This category was not found!", status: false };
      const result = await categoryModel.updateOne({_id: category.id}, {name: category.name, description: category.description});
      if (result) {
        return {
          message: "Category Updated!",
          status: true
        }
      }
        return {
          message: "Createion Failed!",
          status: false
        }
    } catch (error) {
      throw new ErrorHandler(error.message, error.code);
    }
  }
};