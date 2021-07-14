import { ModelOptions, plugin, prop, Ref } from "@typegoose/typegoose";
import mongoPaginate from "../utils/mongoPaginate";
import { Field, ID, ObjectType } from "type-graphql";
import { Base } from "./abstract/base.mongo";
import { Category } from "./category.mongo";
import { Tag } from "./tags.mongo";

export enum POST_STATUS {
  ARCHIVED = "archived",
  DRAFTED = "drafted",
  PUBLISHED = "published",
}

@ObjectType()
@ModelOptions({ schemaOptions: { timestamp: true } })
@plugin(mongoPaginate)
export class Post extends Base {
  @Field(() => ID)
  id: string;

  @prop({ required: true, text: true, index: true })
  @Field({ nullable: false })
  title: string;

  @prop({ required: true, text: true, index: true })
  @Field({ nullable: false })
  slug: string;

  @prop({ required: true, text: true, index: false })
  @Field({ nullable: false })
  url: string;

  @prop({ required: true, text: true, index: false })
  @Field({ nullable: false })
  thumbnail: string;

  @prop({ required: true, text: true, index: false })
  @Field({ nullable: false })
  featured_picture: string;

  @prop({ required: true, index: false })
  @Field({ nullable: false })
  content: string;
  @prop({ enum: POST_STATUS, required: true, default: POST_STATUS.DRAFTED })
  @Field({ nullable: false })
  status: POST_STATUS;

  @prop({ ref: "Category", required: false })
  categories?: Ref<Category>[];

  @prop({ ref: "Tag", required: false })
  tags?: Ref<Tag>[];
}
