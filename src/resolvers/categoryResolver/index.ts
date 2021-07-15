import ErrorHandler from "../../middlewares/errorHandler";
import { Arg, Authorized, Query, Resolver } from "type-graphql";
import { Category, categoryModel } from "../../model/category.mongo";

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
};