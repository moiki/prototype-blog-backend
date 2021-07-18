import {
  getModelForClass,
  modelOptions,
  plugin,
  pre,
  prop,
} from "@typegoose/typegoose";
import mongoPaginate from "../utils/mongoPaginate";
import { Field, ID, ObjectType } from "type-graphql";
import { Base } from "./abstract/base.mongo";
import { postModel } from "./post.mongo";

@pre<Category>("remove", async function (next) {
  // Remove the category from all the posts
  await postModel.updateMany(
    { categories: { $in: this._id } },
    { $pull: this._id }
  );
  next();
})
@ObjectType("CategoryModel")
@modelOptions({ schemaOptions: { timestamps: true, collection: "Category" } })
@plugin(mongoPaginate)
export class Category extends Base {
  @Field(() => ID)
  id: string;

  @prop({ required: true, text: true, index: true })
  @Field({ nullable: false })
  name: string;

  @prop({ required: true, text: true, index: true })
  @Field({ nullable: false })
  description: string;
}

export const categoryModel = getModelForClass(Category);
