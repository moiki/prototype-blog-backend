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

@pre<Tag>("remove", async function (next) {
  // Remove the tag from all the posts
  await postModel.updateMany({ tags: { $in: this._id } }, { $pull: this._id });
  next();
})
@ObjectType("TagModel")
@modelOptions({ schemaOptions: { timestamps: true, collection: "Tag" } })
@plugin(mongoPaginate)
export class Tag extends Base {
  @Field(() => ID)
  id: string;

  @prop({ required: true, text: true, index: true })
  @Field({ nullable: false })
  name: string;
}

export const tagModel = getModelForClass(Tag);
