import { getModelForClass, modelOptions, plugin, prop } from "@typegoose/typegoose";
import mongoPaginate from "../utils/mongoPaginate";
import { Field, ID, ObjectType } from "type-graphql";
import { Base } from "./abstract/base.mongo";

@ObjectType()
@modelOptions({ schemaOptions: { timestamps: true } })
@plugin(mongoPaginate)
export class Tag extends Base {
  @Field(() => ID)
  id: string;

  @prop({ required: true, text: true, index: true })
  @Field({ nullable: false })
  name: string;
}

export const tagModel = getModelForClass(Tag);
